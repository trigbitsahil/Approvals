using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Tenders
{

    [Table("expense_transaction")]
    public class ExpenseTransaction
    {
        [Key]
        [ForeignKey("expense_transaction")]
        [Column("expense_transaction_id")]
        public string ExpenseTransactionId { get; set; }
        [Required]
        [Column("expense_id")]
        public string ExpenseId { get; set; }
        [Required]
        [Column("expense_type_id")]
        public string ExpenseTypeId { get; set; }
        [Required]
        [Column("name")]
        public string Name { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Required]
        [Column("date_of_expense")]
        public DateTime DateOfExpense { get; set; }
        [Column("date_of_payment")]
        public DateTime? DateOfPayment { get; set; }
        [Required]
        [Column("expense_amount")]
        public decimal ExpenseAmount { get; set; }
        [Column("vendor_id")]
        public string VendorId { get; set; }
        [Column("category")]
        public string Category { get; set; }
        [Column("category_id")]
        public string CategoryId { get; set; }
        [Required]
        [Column("is_cleared")]
        public bool IsCleared { get; set; }
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
        [Required]
        [Column("is_approved")]
        public bool IsApproved { get; set; }
        [Column("approved_by")]
        public string ApprovedBy { get; set; }
        [Column("approved_date")]
        public DateTime? ApprovedDate { get; set; }
        [Column("approval_id")]
        public string ApprovalId { get; set; }
        [Required]
        [Column("is_finance_approval_requested")]
        public bool IsFinanceApprovalRequested { get; set; }
        [Required]
        [Column("is_finance_approved")]
        public bool IsFinanceApproved { get; set; }
        [Column("finance_approved_by")]
        public string FinanceApprovedBy { get; set; }
        [Column("finance_approved_date")]
        public DateTime? FinanceApprovedDate { get; set; }
        [Column("finance_approval_id")]
        public string FinanceApprovalId { get; set; }
        [Column("expense_amount_approved")]
        public decimal? ExpenseAmountApproved { get; set; }

        [Column("is_advance")]
        public bool? IsAdvance { get; set; }
        [Column("is_deposit")]
        public bool? IsDeposit { get; set; }
        [Column("deposit_returned_date")]
        public DateTime? DepositReturnedDate { get; set; }
        [Column("deposit_return_notes")]
        public string DepositReturnNotes { get; set; }


        [Column("budget_id")]
        public string? BudgetId { get; set; }
    }
}
