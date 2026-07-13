using MediatR;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.UpdateApprovalApprover
{
    public class UpdateApprovalApproverCommand : IRequest<UpdateApprovalApproverCommandResponse>
    {

        public string ApprovalApproverID { get; set; }

        public string ApprovalId { get; set; }

        public string ApprovalApproverEmail { get; set; }

        public bool IsMasterApprover { get; set; }

        public bool IsResponded { get; set; }

        public bool IsApproved { get; set; }

        public string Remarks { get; set; }

        public DateTime? RespondedDate { get; set; }

     

    }
}
