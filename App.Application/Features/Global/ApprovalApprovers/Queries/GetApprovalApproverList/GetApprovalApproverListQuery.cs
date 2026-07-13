using MediatR;

namespace OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverList
{
    public class GetApprovalApproverListQuery : IRequest<GetApprovalApproverListQueryResponse>
    {
       // public string Category { get; set; }

        public string ApprovalID { get; set; }

    }
}
