using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.UpdateExpenseTransaction
{
    public class UpdateExpenseTransactionCommand : IRequest<UpdateExpenseTransactionCommandResponse>, OOH.Application.Contracts.Infrastructure.ITransactionalCommand
    {

        public string ExpenseTransactionID { get; set; }

        public string ExpenseId { get; set; }

        public string ExpenseTypeId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime DateOfExpense { get; set; }

        public DateTime? DateOfPayment { get; set; }

        public decimal ExpenseAmount { get; set; }

        public string? VendorId { get; set; }

        public string Category { get; set; }

        public string CategoryID { get; set; }

        public bool IsCleared { get; set; }

        public bool? IsFinanceApprovalRequested { get; set; }

        public bool? IsFinanceApproved { get; set; }

        public string? FinanceApprovedBy { get; set; }

        public System.DateTime? FinanceApprovedDate { get; set; }

        public string? FinanceApprovalId { get; set; }

        public double? ExpenseAmountApproved { get; set; }

         
        public bool IsAdvance { get; set; }

        public bool IsDeposit { get; set; }

        public DateTime? DepositReturnedDate { get; set; }

        public string? DepositReturnNotes { get; set; }

        public string? BudgetId { get; set; }

    }
}
