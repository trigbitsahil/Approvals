using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusList
{
    public class GetApprovalStatusListQueryResponse : BaseResponse
    {

        public GetApprovalStatusListQueryResponse() : base()
        {

        }

        public List<ApprovalStatusListVM> Data { get; set; } = default!;

    }
}