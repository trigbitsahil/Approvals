using MediatR;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.DeleteApprovalComment
{
    public class DeleteApprovalCommentCommand : IRequest<DeleteApprovalCommentCommandResponse>
    {
        public string ApprovalCommentId { get; set; }
    }
}
