using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail
{
    public class GetApprovalDetailQueryResponse : BaseResponse
    {

        public GetApprovalDetailQueryResponse() : base()
        {

        }

        public ApprovalDetailVM Data { get; set; } = default!;

    }
}
