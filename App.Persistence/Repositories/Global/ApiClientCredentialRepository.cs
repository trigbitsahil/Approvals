using Dapper;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;
using System;
using System.Threading.Tasks;

namespace OOH.Persistence.Repositories.Global
{
    public class ApiClientCredentialRepository : BaseRepository<ApiClientCredential>, IApiClientCredentialRepository
    {
        public ApiClientCredentialRepository(DapperDBContext dbContext) : base(dbContext)
        {
        }

        public async Task<ApiClientCredential?> GetLatestCredentialsAsync()
        {
            try
            {
                using var conn = _dbContext.CreateConnection();
                var query = "SELECT credential_id AS CredentialId, client_name AS ClientName, email AS Email, password AS Password, created_date AS CreatedDate FROM public.api_client_credentials ORDER BY created_date ASC LIMIT 1;";
                return await conn.QueryFirstOrDefaultAsync<ApiClientCredential>(query);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ApiClientCredentialRepository] Error fetching credentials: {ex.Message}");
                return null;
            }
        }
    }
}
