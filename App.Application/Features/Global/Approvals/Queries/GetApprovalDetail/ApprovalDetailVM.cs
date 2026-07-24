namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail
{
    public class ApprovalDetailVM
    {
        public string ApprovalID { get; set; }

        public string Name { get; set; }
        public string? Reference { get; set; }

        public string Description { get; set; }
        public string? Details { get; set; }

        public string ApprovalType { get; set; }

        public string? ApprovalTypeId { get; set; }

        public string ApprovalStatusName { get; set; }

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

        public string? VendorId { get; set; }
        public string? VendorName { get; set; }
        public string? VendorCategoryName { get; set; }

        public string? DepartmentId { get; set; }

        public string? DepartmentName { get; set; }

        public string?  MediaName { get; set; }

        public string? ContractName { get; set; }
        public string? ContractId { get; set; }
        public string? LinkedContractName { get; set; }
 
        public string? FromBankId { get; set; }
        public string? ToBankId { get; set; }
        public string? FromBankName { get; set; }
        public string? ToBankName { get; set; }
        public decimal? TransactionAmount { get; set; }
    }
}
