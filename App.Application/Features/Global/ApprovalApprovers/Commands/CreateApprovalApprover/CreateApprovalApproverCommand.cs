using MediatR;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.CreateApprovalApprover
{
    public class CreateApprovalApproverCommand : IRequest<CreateApprovalApproverCommandResponse>
    {

        public string ApprovalID { get; set; }

        public string ApprovalApproverEmail { get; set; }

        public bool IsMasterApprover { get; set; }

        public int? ApprovalOrder { get; set; }

    }
}
