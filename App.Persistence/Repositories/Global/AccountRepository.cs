using Dapper;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Features.Global.Accounts.Queries.GetAccountList;
using OOH.Domain.Entities.Global;

namespace OOH.Persistence.Repositories
{
    public class AccountRepository : BaseRepository<Account>, IAccountRepository
    {
        public AccountRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



  public async Task<List<AccountListVM>> ListAllAccountsAsync(string category, string categoryID)
  {
      IEnumerable<AccountListVM> result;
      try
      {

 
                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()}  FROM Account";

                query = query + $" where Tenant_ID = @tenantID ";

                query = query + $" and Is_Voided = false ";

                query = query + $" and Category = @category ";

                query = query + $" and Category_ID = @categoryID ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<AccountListVM>(query, new { tenantID = _dbContext.currentTenantID, category = category, categoryID = categoryID });

                }
 


      }
      catch (Exception ex)
      {
          Console.WriteLine($"Error fetching records from db: ${ex.Message}");
          throw new Exception("Unable to fetch data. Please contact the administrator.");
      }

      return result.ToList();
  }



    }
}