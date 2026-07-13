namespace OOH.API.Middleware
{
    public static class MiddlewareExtensions 
    {
        public static IApplicationBuilder UseCustomMiddlewareHandler(this IApplicationBuilder builder)
        {
            builder.UseMiddleware<ExceptionHandlerMiddleware>();

            //builder.UseMiddleware<TenantResolverMiddleware>();

            builder.UseMiddleware<ActivityLoggingMiddleware>();

            return builder;



        }
    }
}
