using Dapper;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeList;
using OOH.Domain.Entities.Global;

namespace OOH.Persistence.Repositories
{
    public class ApprovalTypeRepository : BaseRepository<ApprovalType>, IApprovalTypeRepository
    {
        public ApprovalTypeRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



  public async Task<List<ApprovalTypeListVM>> ListAllApprovalTypesAsync(string category, string categoryID)
  {
      IEnumerable<ApprovalTypeListVM> result;
      try
      {

 
                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()}  FROM ApprovalType";

                query = query + $" where Tenant_ID = @tenantID ";

                query = query + $" and Is_Voided = false ";

                query = query + $" and Category = @category ";

                query = query + $" and Category_ID = @categoryID ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ApprovalTypeListVM>(query, new { tenantID = _dbContext.currentTenantID, category = category, categoryID = categoryID });

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