using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Domain.Entities.Global
{
    [Table("bank_retention_balance")]
    public class BankRetentionBalance
    {
        [Key]
        [Column("id")]
        public string Id { get; set; }

        [Column("approval_id")]
        public string? ApprovalId { get; set; }

        [Required]
        [Column("bank_id")]
        public string BankId { get; set; }

        [Column("entity_type")]
        public string? EntityType { get; set; } = "Bank";

        [Column("total_deposit")]
        public decimal TotalDeposit { get; set; }

        [Column("total_withdrawal")]
        public decimal TotalWithdrawal { get; set; }

        [Column("running_balance")]
        public decimal RunningBalance { get; set; }

        [Required]
        [Column("tenant_id")]
        public string TenantId { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }

        [Column("last_modified_date")]
        public DateTime? LastModifiedDate { get; set; }
    }
}
