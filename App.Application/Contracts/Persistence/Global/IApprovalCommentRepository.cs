using OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentList;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Contracts.Persistence.Global
{

    public interface IApprovalCommentRepository : IAsyncRepository<ApprovalComment>
    {
        Task<List<ApprovalCommentListVM>> ListAllApprovalCommentsAsync(string ApprovalID );
    }

}
