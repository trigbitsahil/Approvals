using MediatR;

namespace OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentDetail
{
    public class GetApprovalCommentDetailQuery : IRequest<GetApprovalCommentDetailQueryResponse>
    {
        public string ApprovalCommentId { get; set; }
    }
}
