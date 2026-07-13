using Dapper;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverList;
using OOH.Domain.Entities.Global;

namespace OOH.Persistence.Repositories
{
    public class ApprovalApproverRepository : BaseRepository<ApprovalApprover>, IApprovalApproverRepository
    {
        public ApprovalApproverRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



  public async Task<List<ApprovalApproverListVM>> ListAllApprovalApproversAsync(string approvalID )
  {
      IEnumerable<ApprovalApproverListVM> result;
      try
      {

 
                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()}  FROM Approval_Approver";

                query = query + $" where Tenant_ID = @tenantID ";

                query = query + $" and Is_Voided = false ";

                query = query + $" and approval_id = @approvalID ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ApprovalApproverListVM>(query, new { tenantID = _dbContext.currentTenantID,  approvalID = approvalID });

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