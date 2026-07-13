//using Dapper;
//using OOH.Application.Contracts.Persistence.Global;
//using OOH.Application.Features.Global.ApprovalMedias.Queries.GetApprovalMediaList;
//using OOH.Domain.Entities.Global;
//
//namespace OOH.Persistence.Repositories
//{
//    public class ApprovalMediaRepository : BaseRepository<ApprovalMedia>, IApprovalMediaRepository
//    {
//        public ApprovalMediaRepository(DapperDBContext dbContext) : base(dbContext)
//        {
//
//        }
//
//
//
//  public async Task<List<ApprovalMediaListVM>> ListAllApprovalMediasAsync(string category, string categoryID)
//  {
//      IEnumerable<ApprovalMediaListVM> result;
//      try
//      {
//
// 
//                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()}  FROM ApprovalMedia";
//
//                query = query + $" where Tenant_Id = @tenantID ";
//
//                query = query + $" and Is_Voided = false ";
//
//                query = query + $" and Category = @category ";
//
//                query = query + $" and Category_Id = @categoryID ";
//
//
//
//                using (var dbConn = _dbContext.CreateConnection())
//                {
//                    result = await dbConn.QueryAsync<ApprovalMediaListVM>(query, new { tenantID = _dbContext.currentTenantID, category = category, categoryID = categoryID });
//
//                }
// 
//
//
//      }
//      catch (Exception ex)
//      {
//          Console.WriteLine($"Error fetching records from db: ${ex.Message}");
//          throw new Exception("Unable to fetch data. Please contact the administrator.");
//      }
//
//      return result.ToList();
//  }
//
//
//
//    }
//}