using MediatR;

namespace OOH.Application.Features.Global.Approvals.Commands.DeleteApproval
{
    public class DeleteApprovalCommand : IRequest<DeleteApprovalCommandResponse>
    {
        public string ApprovalID { get; set; }
    }
}
