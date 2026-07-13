using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalList
{
    public class GetApprovalListQueryResponse : BaseResponse
    {

        public GetApprovalListQueryResponse() : base()
        {

        }

        public List<ApprovalListVM> Data { get; set; } = default!;

    }
}