using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentList
{
    public class GetApprovalCommentListQueryResponse : BaseResponse
    {

        public GetApprovalCommentListQueryResponse() : base()
        {

        }

        public List<ApprovalCommentListVM> Data { get; set; } = default!;

    }
}