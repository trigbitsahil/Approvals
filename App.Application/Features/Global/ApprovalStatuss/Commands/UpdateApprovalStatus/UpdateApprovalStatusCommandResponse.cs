using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalStatuss.Commands.UpdateApprovalStatus
{
    public class UpdateApprovalStatusCommandResponse : BaseResponse
    {

        public UpdateApprovalStatusCommandResponse() : base()
        {

        }

        public UpdateApprovalStatusDto Data { get; set; } = default!;

    }
}
