using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using OOH.Application.Contracts.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Persistence
{
    internal class TenantDBContext
    {
        private readonly IConfiguration _configuration;

        public string currentTenantID;

        private readonly string connectionstring;
        public TenantDBContext(IConfiguration configuration, ICurrentTenantService currentTenantService)
        {
            this._configuration = configuration;
            this.connectionstring = this._configuration.GetConnectionString("DefaultConnection");
            this.currentTenantID = currentTenantService.TenantId;
        }
        public IDbConnection CreateConnection() => new SqlConnection(connectionstring);
    }
}
