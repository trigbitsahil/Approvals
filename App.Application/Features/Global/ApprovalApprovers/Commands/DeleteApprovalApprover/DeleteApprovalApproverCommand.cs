using MediatR;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.DeleteApprovalApprover
{
    public class DeleteApprovalApproverCommand : IRequest<DeleteApprovalApproverCommandResponse>
    {
        public string ApprovalApproverID { get; set; }
    }
}
