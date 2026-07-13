namespace OOH.Application.Features.Global.Approvals.Commands.CreateApproval
{
    public class CreateApprovalDto
    {

        public string ApprovalID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string ApprovalType { get; set; }

        public string? ApprovalTypeId { get; set; }

        public string ApprovalStatusId { get; set; }

        public string Priority { get; set; }

        public bool AllApproverApprove { get; set; }

        public string RequestedBy { get; set; }

        public DateTime RequestedDate { get; set; }

        public string? Category { get; set; }

        public string? CategoryId { get; set; }

        public bool IsVoided { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string LastModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }


        public string? MediaId { get; set; }

        public DateTime? DateOfLetter { get; set; }

        public string? DepartmentId { get; set; }

 

    }
}
