using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.CreateApprovalComment
{
    public class CreateApprovalCommentCommandResponse : BaseResponse
    {

        public CreateApprovalCommentCommandResponse() : base()
        {

        }

        public CreateApprovalCommentDto Data { get; set; } = default!;

    }
}
