using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.DeleteApprovalApprover
{
    public class DeleteApprovalApproverCommandResponse : BaseResponse
    {

        public DeleteApprovalApproverCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
