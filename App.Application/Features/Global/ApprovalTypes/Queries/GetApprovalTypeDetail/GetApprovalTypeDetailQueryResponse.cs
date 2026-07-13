using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeDetail
{
    public class GetApprovalTypeDetailQueryResponse : BaseResponse
    {

        public GetApprovalTypeDetailQueryResponse() : base()
        {

        }

        public ApprovalTypeDetailVM Data { get; set; } = default!;

    }
}
