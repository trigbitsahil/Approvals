using MediatR;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.CreateExpenseTransaction
{
    public class CreateExpenseTransactionCommand : IRequest<CreateExpenseTransactionCommandResponse>, OOH.Application.Contracts.Infrastructure.ITransactionalCommand
    {

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

        public string? ApprovalId { get; set; }




        public bool  IsAdvance { get; set; }

        public bool  IsDeposit { get; set; }

        public string? BudgetId { get; set; }


        public double? ExpenseAmountApproved { get; set; }

        public bool IsApproved { get; set; }


    }
}
