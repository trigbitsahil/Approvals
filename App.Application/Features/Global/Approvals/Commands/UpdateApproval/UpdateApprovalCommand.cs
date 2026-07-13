using MediatR;

namespace OOH.Application.Features.Global.Approvals.Commands.UpdateApproval
{
    public class UpdateApprovalCommand : IRequest<UpdateApprovalCommandResponse>
    {


        public string ApprovalID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string ApprovalType { get; set; }

        public string? ApprovalTypeId { get; set; }

        public string ApprovalStatusId { get; set; }

        public string Priority { get; set; }

        public bool AllApproverApprove { get; set; }

        public string? MediaId { get; set; }

        public DateTime? DateOfLetter { get; set; }

        public string? DepartmentId { get; set; }




    }
}
