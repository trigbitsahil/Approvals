using MediatR;

namespace OOH.Application.Features.Global.ApprovalStatuss.Commands.DeleteApprovalStatus
{
    public class DeleteApprovalStatusCommand : IRequest<DeleteApprovalStatusCommandResponse>
    {
        public string ApprovalStatusID { get; set; }
    }
}
