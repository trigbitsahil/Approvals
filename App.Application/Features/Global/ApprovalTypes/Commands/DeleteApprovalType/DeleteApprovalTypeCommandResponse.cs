using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalTypes.Commands.DeleteApprovalType
{
    public class DeleteApprovalTypeCommandResponse : BaseResponse
    {

        public DeleteApprovalTypeCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
