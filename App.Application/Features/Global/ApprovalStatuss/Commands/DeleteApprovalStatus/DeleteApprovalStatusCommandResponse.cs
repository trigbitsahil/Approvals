using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalStatuss.Commands.DeleteApprovalStatus
{
    public class DeleteApprovalStatusCommandResponse : BaseResponse
    {

        public DeleteApprovalStatusCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
