using Dapper;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusList;
using OOH.Domain.Entities.Global;

namespace OOH.Persistence.Repositories
{
    public class ApprovalStatusRepository : BaseRepository<ApprovalStatus>, IApprovalStatusRepository
    {
        public ApprovalStatusRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



  public async Task<List<ApprovalStatusListVM>> ListAllApprovalStatussAsync(string category, string categoryID)
  {
      IEnumerable<ApprovalStatusListVM> result;
      try
      {

 
                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()}  FROM ApprovalStatus";

                query = query + $" where Tenant_ID = @tenantID ";

                query = query + $" and Is_Voided = false ";

                query = query + $" and Category = @category ";

                query = query + $" and Category_ID = @categoryID ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ApprovalStatusListVM>(query, new { tenantID = _dbContext.currentTenantID, category = category, categoryID = categoryID });

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