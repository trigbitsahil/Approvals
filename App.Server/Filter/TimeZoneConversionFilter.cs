using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace OOH.API.Filter
{
    public class TimeZoneConversionFilter : IAsyncResultFilter
    {
        
        public TimeZoneConversionFilter( )
        {
           // _tenantTimeZoneService = tenantTimeZoneService;
        }

        public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
        {
            var response = context.Result as ObjectResult;
            if (response?.Value != null)
            {
                //this will later by dynamic according to tenant
                TimeZoneInfo tz = TimeZoneInfo.FindSystemTimeZoneById("Asia/Kolkata");

                ConvertDatesRecursively(response.Value, tz);
            }

            await next();
        }

        private void ConvertDatesRecursively(object obj, TimeZoneInfo timeZone)
        {
            if (obj == null) return;

            var type = obj.GetType();

            if (typeof(System.Collections.IEnumerable).IsAssignableFrom(type) && type != typeof(string))
            {
                foreach (var item in (System.Collections.IEnumerable)obj)
                    ConvertDatesRecursively(item, timeZone);

                return;
            }

            if (type.IsPrimitive || type == typeof(string)) return;

            foreach (var prop in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                if (!prop.CanRead || !prop.CanWrite) continue;

                var value = prop.GetValue(obj);

                if (value is DateTime dt)
                {
                    if (dt.Kind == DateTimeKind.Unspecified)
                        dt = DateTime.SpecifyKind(dt, DateTimeKind.Utc);

                    if (dt.Kind == DateTimeKind.Utc)
                    {
                        var converted = TimeZoneInfo.ConvertTimeFromUtc(dt, timeZone);
                        prop.SetValue(obj, converted);
                    }
                }
                else if (prop.PropertyType == typeof(DateTime?))
                {
                    var nullableDate = value as DateTime?;

                    if (nullableDate.HasValue)
                    {
                        var date = nullableDate.Value;

                        if (date.Kind == DateTimeKind.Unspecified)
                            date = DateTime.SpecifyKind(date, DateTimeKind.Utc);

                        if (date.Kind == DateTimeKind.Utc)
                        {
                            var converted = TimeZoneInfo.ConvertTimeFromUtc(date, timeZone);
                            prop.SetValue(obj, (DateTime?)converted);
                        }
                    }
                }
                else
                {
                    ConvertDatesRecursively(value, timeZone);
                }
            }
        }
    }

}
