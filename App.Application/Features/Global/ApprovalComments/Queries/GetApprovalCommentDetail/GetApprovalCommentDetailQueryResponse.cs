using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentDetail
{
    public class GetApprovalCommentDetailQueryResponse : BaseResponse
    {

        public GetApprovalCommentDetailQueryResponse() : base()
        {

        }

        public ApprovalCommentDetailVM Data { get; set; } = default!;

    }
}
