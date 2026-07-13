using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Approvals.Commands.DeleteApproval
{
    public class DeleteApprovalCommandResponse : BaseResponse
    {

        public DeleteApprovalCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
