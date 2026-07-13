using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalWithTypeDetail
{
    public class GetApprovalWithTypeDetailQueryResponse : BaseResponse
    {

        public GetApprovalWithTypeDetailQueryResponse() : base()
        {

        }

        public ApprovalWithTypeDetailVM Data { get; set; } = default!;

    }
}
