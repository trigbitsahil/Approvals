using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalTypes.Commands.UpdateApprovalType
{
    public class UpdateApprovalTypeCommandResponse : BaseResponse
    {

        public UpdateApprovalTypeCommandResponse() : base()
        {

        }

        public UpdateApprovalTypeDto Data { get; set; } = default!;

    }
}
