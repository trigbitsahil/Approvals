using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Models.Files;
using OOH.Application.Models.Mail;
using OOH.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Infrastructure
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));

            services.AddTransient<IEmailService, EmailService>();
          

            services.Configure<BlobSettings>(configuration.GetSection("BlobSettings"));

            services.AddTransient<IBlobService, BlobService>();

 




            services.AddScoped(_ =>
            {
                return new BlobServiceClient(configuration.GetConnectionString("BlobConnectionString"));
            });


            services.AddScoped<ICurrentTenantService, CurrentTenantService>();



            // services.AddTransient<ICsvExporter, CsvExporter>();

            return services;
        }
    }
}
