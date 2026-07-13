using MediatR;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.CreateApprovalComment
{
    public class CreateApprovalCommentCommand : IRequest<CreateApprovalCommentCommandResponse>
    {
        public string ApprovalId { get; set; }
        public string CommentText { get; set; }





    }
}
