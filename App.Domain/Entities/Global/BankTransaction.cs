using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Domain.Entities.Global
{
    [Table("bank_transactions")]
    public class BankTransaction
    {
        [Key]
        [Column("transaction_id")]
        public string TransactionId { get; set; }

        [Column("from_bank_id")]
        public string? FromBankId { get; set; }

        [Column("to_bank_id")]
        public string? ToBankId { get; set; }

        [Column("vendor_id")]
        public string? VendorId { get; set; }

        [Required]
        [Column("approval_id")]
        public string ApprovalId { get; set; }

        [Required]
        [Column("transaction_type")]
        public string TransactionType { get; set; }

        [Required]
        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("deposit")]
        public decimal Deposit { get; set; }

        [Column("withdrawal")]
        public decimal Withdrawal { get; set; }

        [Column("running_balance")]
        public decimal RunningBalance { get; set; }

        [Column("cleared_on")]
        public DateTime? ClearedOn { get; set; }

        [Required]
        [Column("is_voided")]
        public bool IsVoided { get; set; }

        [Required]
        [Column("is_reversed")]
        public bool IsReversed { get; set; }

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
