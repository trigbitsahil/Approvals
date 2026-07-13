using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Approvals.Commands.UpdateApproval
{
    public class UpdateApprovalCommandResponse : BaseResponse
    {

        public UpdateApprovalCommandResponse() : base()
        {

        }

        public UpdateApprovalDto Data { get; set; } = default!;

    }
}
