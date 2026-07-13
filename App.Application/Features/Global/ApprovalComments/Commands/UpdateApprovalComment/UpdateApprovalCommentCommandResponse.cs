using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.UpdateApprovalComment
{
    public class UpdateApprovalCommentCommandResponse : BaseResponse
    {

        public UpdateApprovalCommentCommandResponse() : base()
        {

        }

        public UpdateApprovalCommentDto Data { get; set; } = default!;

    }
}
