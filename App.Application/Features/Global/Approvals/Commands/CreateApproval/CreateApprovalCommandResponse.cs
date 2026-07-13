using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Approvals.Commands.CreateApproval
{
    public class CreateApprovalCommandResponse : BaseResponse
    {

        public CreateApprovalCommandResponse() : base()
        {

        }

        public CreateApprovalDto Data { get; set; } = default!;

    }
}
