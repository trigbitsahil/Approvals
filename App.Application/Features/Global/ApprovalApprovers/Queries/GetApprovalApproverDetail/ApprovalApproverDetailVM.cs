namespace OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverDetail
{
    public class ApprovalApproverDetailVM
    {
        public string ApprovalApproverID { get; set; }

        public string ApprovalId { get; set; }

        public string ApprovalApproverEmail { get; set; }

        public bool IsMasterApprover { get; set; }

        public bool IsResponded { get; set; }

        public bool IsApproved { get; set; }

        public string Remarks { get; set; }

        public DateTime? RespondedDate { get; set; }

        public bool IsVoided { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string LastModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }


        public int? ApprovalOrder { get; set; }

    }
}
