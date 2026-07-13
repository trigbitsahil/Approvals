using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Application.Contracts.Persistence.Tenders;
 
using OOH.Persistence.Repositories;
 
using OOH.Persistence.Repositories.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Persistence
{
    public static class PersistenceServiceRegistration
    {

        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            //services.AddDbContext<GloboTicketDbContext>(options =>
            //    options.UseSqlServer(configuration.GetConnectionString("GloboTicketTicketManagementConnectionString")));

            services.AddTransient<DapperDBContext>();

            services.AddScoped(typeof(IAsyncRepository<>), typeof(BaseRepository<>));

            services.AddScoped<ICityRepository, CityRepository>();

            services.AddScoped<IGovtBodyRepository, GovtBodyRepository>();

            

            services.AddScoped<IVendorRepository, VendorRepository>();

          

            services.AddScoped<ICustomerRepository, CustomerRepository>();

            services.AddScoped<IApprovalTypeRepository, ApprovalTypeRepository>();


            services.AddScoped<IApprovalRepository, ApprovalRepository>();


            services.AddScoped<IApprovalApproverRepository, ApprovalApproverRepository>();


            services.AddScoped<IApprovalStatusRepository, ApprovalStatusRepository>();

            services.AddScoped<IApprovalCommentRepository, ApprovalCommentRepository>();

            services.AddScoped<IExpenseCategoryRepository, ExpenseCategoryRepository>();
            services.AddScoped<IExpenseTypeRepository, ExpenseTypeRepository>();
            services.AddScoped<IExpenseTransactionRepository, ExpenseTransactionRepository>();
            services.AddScoped<IExpenseRepository, ExpenseRepository>();


            return services;
        }
    }
}
