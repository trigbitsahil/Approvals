using OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverList;
 
using OOH.Domain.Entities.Global;

namespace OOH.Application.Contracts.Persistence
{

    public interface IApprovalApproverRepository : IAsyncRepository<ApprovalApprover>
    {
        Task<List<ApprovalApproverListVM>> ListAllApprovalApproversAsync(string approvalID );
    }

}
