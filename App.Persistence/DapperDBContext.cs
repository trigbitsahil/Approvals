using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using OOH.Application.Contracts.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Npgsql;
namespace OOH.Persistence
{
    public class DapperDBContext
    {
        private readonly IConfiguration _configuration;
        private readonly ILoggedInUserService _loggedInUserService;

        private string? _currentTenantID;
        public string currentTenantID
        {
            get => _currentTenantID ?? _loggedInUserService.TenantId;
            set => _currentTenantID = value;
        }

        private string? _currentUserEmail;
        public string currentUserEmail
        {
            get => _currentUserEmail ?? _loggedInUserService.UserEmail;
            set => _currentUserEmail = value;
        }


        private readonly string connectionstring;
        public DapperDBContext(IConfiguration configuration, ILoggedInUserService loggedInUserService)
        {
            this._configuration = configuration;
            this._loggedInUserService = loggedInUserService;
            this.connectionstring = this._configuration.GetConnectionString("DefaultConnection");
        }
        public IDbConnection CreateConnection() => new NpgsqlConnection(connectionstring);
    }
}
