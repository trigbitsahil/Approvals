using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Domain.Entities.Transactions
{
    [Table("transaction_history")]
    public class TransactionHistory
    {
        [Key]
        [Column("history_id")]
        public string HistoryId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("transaction_id")]
        public string TransactionId { get; set; }

        [Required]
        [Column("old_status")]
        public string OldStatus { get; set; }

        [Required]
        [Column("new_status")]
        public string NewStatus { get; set; }

        [Column("notes")]
        public string Notes { get; set; }

        // Audit Columns
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
    }
}
