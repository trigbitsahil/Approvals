namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.CreateExpenseTransaction
{
    public class CreateExpenseTransactionDto
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

        public string? BudgetId { get; set; }


        public double? ExpenseAmountApproved { get; set; }

        public bool IsApproved { get; set; }
    }
}
