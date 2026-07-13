using MediatR;

namespace OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentList
{
    public class GetApprovalCommentListQuery : IRequest<GetApprovalCommentListQueryResponse>
    {

        public string ApprovalId { get; set; }

    }
}
