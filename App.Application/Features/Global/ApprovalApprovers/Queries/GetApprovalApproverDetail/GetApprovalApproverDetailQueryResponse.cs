using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverDetail
{
    public class GetApprovalApproverDetailQueryResponse : BaseResponse
    {

        public GetApprovalApproverDetailQueryResponse() : base()
        {

        }

        public ApprovalApproverDetailVM Data { get; set; } = default!;

    }
}
