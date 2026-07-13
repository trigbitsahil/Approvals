using MediatR;

namespace OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverDetail
{
    public class GetApprovalApproverDetailQuery : IRequest<GetApprovalApproverDetailQueryResponse>
    {
        public string ApprovalApproverID { get; set; }
    }
}
