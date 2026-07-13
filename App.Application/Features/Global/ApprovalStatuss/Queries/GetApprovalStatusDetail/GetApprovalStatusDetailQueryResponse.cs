using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusDetail
{
    public class GetApprovalStatusDetailQueryResponse : BaseResponse
    {

        public GetApprovalStatusDetailQueryResponse() : base()
        {

        }

        public ApprovalStatusDetailVM Data { get; set; } = default!;

    }
}
