using System;

namespace OOH.API.Filter
{
    /// <summary>
    /// Attribute used to suppress automatic timezone conversion by TimeZoneConversionFilter
    /// on decorated controllers, action methods, classes, or properties.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method | AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public class SkipTimeZoneConversionAttribute : Attribute
    {
    }
}
