using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Domain.Entities.Global
{

    [Table("approval_approver")]
    public class ApprovalApprover
     {
        [Key]
        [ForeignKey("approval_approver")]
        [Column("approval_approver_id")]
        public string ApprovalApproverId { get; set; }
        [Required]
        [Column("approval_id")]
        public string ApprovalId { get; set; }
        [Required]
        [Column("approval_approver_email")]
        public string ApprovalApproverEmail { get; set; }
        [Required]
        [Column("is_master_approver")]
        public bool IsMasterApprover { get; set; }
        [Required]
        [Column("is_responded")]
        public bool IsResponded { get; set; }
        [Required]
        [Column("is_approved")]
        public bool IsApproved { get; set; }
        [Column("remarks")]
        public string Remarks { get; set; }
        [Column("responded_date")]
        public DateTime? RespondedDate { get; set; }
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


        [Column("approval_order")]
        public int? ApprovalOrder { get; set; }
    }
}
