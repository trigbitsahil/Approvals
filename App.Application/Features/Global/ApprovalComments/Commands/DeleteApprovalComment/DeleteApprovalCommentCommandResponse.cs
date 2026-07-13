using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.DeleteApprovalComment
{
    public class DeleteApprovalCommentCommandResponse : BaseResponse
    {

        public DeleteApprovalCommentCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
