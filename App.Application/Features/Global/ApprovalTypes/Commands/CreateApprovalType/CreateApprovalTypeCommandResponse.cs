using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalTypes.Commands.CreateApprovalType
{
    public class CreateApprovalTypeCommandResponse : BaseResponse
    {

        public CreateApprovalTypeCommandResponse() : base()
        {

        }

        public CreateApprovalTypeDto Data { get; set; } = default!;

    }
}
