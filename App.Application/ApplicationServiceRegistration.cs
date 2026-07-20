using Microsoft.Extensions.DependencyInjection;
using System;
using OOH.Application.Behaviors;
using MediatR;
using System.Reflection;

namespace OOH.Application
{
    public static class ApplicationServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg => cfg.AddMaps(AppDomain.CurrentDomain.GetAssemblies()));

            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies
            (AppDomain.CurrentDomain.GetAssemblies()));

            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));

            services.AddSingleton<OOH.Application.Contracts.Infrastructure.IEncryptionService, OOH.Application.Contracts.Infrastructure.EncryptionService>();

            return services;
        }
    }
}
