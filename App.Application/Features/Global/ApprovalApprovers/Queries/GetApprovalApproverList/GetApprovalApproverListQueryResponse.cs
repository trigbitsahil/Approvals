using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverList
{
    public class GetApprovalApproverListQueryResponse : BaseResponse
    {

        public GetApprovalApproverListQueryResponse() : base()
        {

        }

        public List<ApprovalApproverListVM> Data { get; set; } = default!;

    }
}