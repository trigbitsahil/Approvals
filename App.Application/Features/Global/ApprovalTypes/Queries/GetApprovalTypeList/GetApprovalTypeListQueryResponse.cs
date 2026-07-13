using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeList
{
    public class GetApprovalTypeListQueryResponse : BaseResponse
    {

        public GetApprovalTypeListQueryResponse() : base()
        {

        }

        public List<ApprovalTypeListVM> Data { get; set; } = default!;

    }
}