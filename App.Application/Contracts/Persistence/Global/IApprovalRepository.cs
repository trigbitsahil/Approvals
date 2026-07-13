using MediatR;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalList;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalListByUser;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalWithTypeDetail;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Contracts.Persistence
{

    public interface IApprovalRepository : IAsyncRepository<Approval>
    {
        Task<List<ApprovalListVM>> ListAllApprovalsAsync(string category, string categoryID);
        Task<List<ApprovalListByUserVM>> ListAllApprovalsByUserAsync();

        Task<ApprovalDetailVM> GetApprovalDetails(string id, string category);


        Task<ApprovalWithTypeDetailVM> GetApprovalWithApprovalTypeDetails (string id, string category);

    }

}
