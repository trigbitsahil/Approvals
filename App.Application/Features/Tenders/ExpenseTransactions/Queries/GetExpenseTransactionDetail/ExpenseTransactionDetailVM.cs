namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail
{
    public class ExpenseTransactionDetailVM
    {

        public string ExpenseTransactionID { get; set; }

        public string ExpenseId { get; set; }

        public string ExpenseTypeId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime DateOfExpense { get; set; }

        public DateTime? DateOfPayment { get; set; }

        public decimal ExpenseAmount { get; set; }

        public string VendorId { get; set; }
        public string Category { get; set; }

        public string CategoryID { get; set; }

        public bool IsCleared { get; set; }

        public bool IsVoided { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string LastModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }


        public string ExpenseName { get; set; }

        public string ExpenseTypeName { get; set; }


        public bool? IsFinanceApprovalRequested { get; set; }

        public bool? IsFinanceApproved { get; set; }

        public string? FinanceApprovedBy { get; set; }

        public System.DateTime? FinanceApprovedDate { get; set; }

        public string? FinanceApprovalId { get; set; }

        public double? ExpenseAmountApproved { get; set; }

  
        public string?  ApprovalId { get; set; }

         
        public bool IsAdvance { get; set; }

        public bool IsDeposit { get; set; }

        public DateTime? DepositReturnedDate { get; set; }

        public string DepositReturnNotes { get; set; }


        public string? BudgetId { get; set; }


        public string VendorName { get; set; }


    }
}
