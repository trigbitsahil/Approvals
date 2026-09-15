using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Domain.Entities.Global
{
    [Table("approval_history")]
    public class ApprovalHistory
    {
        [Key]
        [Column("history_id")]
        public string HistoryId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("approval_id")]
        public string ApprovalId { get; set; }

        [Required]
        [Column("action")]
        public string Action { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("performed_by")]
        public string PerformedBy { get; set; }

        [Column("performed_by_name")]
        public string PerformedByName { get; set; }

        [Column("remarks")]
        public string Remarks { get; set; }

        // Audit Columns
        [Required]
        [Column("is_voided")]
        public bool IsVoided { get; set; } = false;

        [Column("created_by")]
        public string CreatedBy { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [Column("last_modified_by")]
        public string LastModifiedBy { get; set; }

        [Column("last_modified_date")]
        public DateTime? LastModifiedDate { get; set; }

        [Required]
        [Column("tenant_id")]
        public string TenantId { get; set; }
    }
}
