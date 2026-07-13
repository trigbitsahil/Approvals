using Dapper;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentList;
using OOH.Domain.Entities.Global;

namespace OOH.Persistence.Repositories
{
    public class ApprovalCommentRepository : BaseRepository<ApprovalComment>, IApprovalCommentRepository
    {
        public ApprovalCommentRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



  public async Task<List<ApprovalCommentListVM>> ListAllApprovalCommentsAsync(string ApprovalID )
  {
      IEnumerable<ApprovalCommentListVM> result;
      try
      {

 
                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()}  FROM Approval_Comment";

                query = query + $" where Tenant_Id = @tenantID ";

                query = query + $" and Is_Voided = false ";

                query = query + $" and approval_id = @approvalID ";
 
                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ApprovalCommentListVM>(query, new { tenantID = _dbContext.currentTenantID, approvalID = ApprovalID});

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