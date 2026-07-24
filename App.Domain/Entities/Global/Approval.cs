using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Global
{

    [Table("approval")]
    public class Approval
     {
        [Key]
        [ForeignKey("approval")]
        [Column("approval_id")]
        public string ApprovalId { get; set; }
        [Required]
        [Column("name")]
        public string Name { get; set; }
        [Column("description")]
        public string Description { get; set; }

        [Column("reference")]
        public string? Reference { get; set; }

        [Column("details")]
        public string? Details { get; set; }

        [Required]
        [Column("approval_type")]
        public string ApprovalType { get; set; }
        [Column("approval_type_id")]
        public string ApprovalTypeId { get; set; }
        [Required]
        [Column("approval_status_id")]
        public string ApprovalStatusId { get; set; }
        [Column("priority")]
        public string Priority { get; set; }
        [Required]
        [Column("all_approver_approve")]
        public bool AllApproverApprove { get; set; }
        [Column("requested_by")]
        public string RequestedBy { get; set; }
        [Required]
        [Column("requested_date")]
        public DateTime RequestedDate { get; set; }
        [Column("category")]
        public string Category { get; set; }
        [Column("category_id")]
        public string CategoryId { get; set; }
        
        [Column("contract_id")]
        public string? ContractId { get; set; }
        
        [Required]
        [Column("is_voided")]
        public bool IsVoided { get; set; }
        [Column("created_by")]
        public string CreatedBy { get; set; }
        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
        [Column("last_modified_by")]
        public string LastModifiedBy { get; set; }
        [Column("last_modified_date")]
        public DateTime? LastModifiedDate { get; set; }
        [Required]
        [Column("tenant_id")]
        public string TenantId { get; set; }
        [Column("media_id")]
        public string? MediaId { get; set; }
        [Column("date_of_letter")]
        public DateTime? DateOfLetter { get; set; }
        [Column("department_id")]
        public string? DepartmentId { get; set; }

        [Column("from_bank_id")]
        public string? FromBankId { get; set; }

        [Column("to_bank_id")]
        public string? ToBankId { get; set; }

        [Column("vendor_id")]
        public string? VendorId { get; set; }

        [Column("transaction_amount")]
        public decimal? TransactionAmount { get; set; }



    }
}
