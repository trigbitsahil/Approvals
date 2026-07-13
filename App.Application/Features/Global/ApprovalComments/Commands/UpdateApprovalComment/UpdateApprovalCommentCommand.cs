using MediatR;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.UpdateApprovalComment
{
    public class UpdateApprovalCommentCommand : IRequest<UpdateApprovalCommentCommandResponse>
    {

        public string ApprovalCommentId { get; set; }
        public string ApprovalId { get; set; }
        public string CommentText { get; set; }
        






    }
}
