using OOH.Application.Contracts.Infrastructure;
using OOH.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Infrastructure.Services
{
    internal class CurrentTenantService : ICurrentTenantService
    {

        //protected readonly TenantDBContext _dbContext;

        //public CurrentTenantService(TenantDBContext dbContext)
        //{
        //    _dbContext = dbContext;
        //}

        public string? TenantId { get ; set ; }


        public async Task<bool> SetTenant(string tenant)
        {
            //[To-Do] check credentials and validate tenant
            // var tenantInfo;// = null;
          //  _dbContext.GetType

            if (!string.IsNullOrWhiteSpace(tenant) )
            {

                TenantId = tenant;
           

                return true;
                 

            }
            {
                throw new Exception("Invalid Tenant");
            
            }
                 
        }
    }
}
