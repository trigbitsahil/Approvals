using MediatR;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail
{
    public class GetApprovalDetailQuery : IRequest<GetApprovalDetailQueryResponse>
    {
        public string ApprovalID { get; set; }
    }
}
