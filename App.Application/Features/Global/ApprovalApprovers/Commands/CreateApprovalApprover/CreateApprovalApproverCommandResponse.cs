using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.CreateApprovalApprover
{
    public class CreateApprovalApproverCommandResponse : BaseResponse
    {

        public CreateApprovalApproverCommandResponse() : base()
        {

        }

        public CreateApprovalApproverDto Data { get; set; } = default!;

    }
}
