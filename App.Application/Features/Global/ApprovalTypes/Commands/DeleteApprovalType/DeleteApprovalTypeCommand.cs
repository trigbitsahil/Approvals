using MediatR;

namespace OOH.Application.Features.Global.ApprovalTypes.Commands.DeleteApprovalType
{
    public class DeleteApprovalTypeCommand : IRequest<DeleteApprovalTypeCommandResponse>
    {
        public string ApprovalTypeID { get; set; }
    }
}
