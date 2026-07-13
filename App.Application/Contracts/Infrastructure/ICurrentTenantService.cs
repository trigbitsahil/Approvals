using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Contracts.Infrastructure
{
    public interface ICurrentTenantService
    {
        string? TenantId { get; set; }
 

        public Task<bool> SetTenant(string tenant );
    }
}
