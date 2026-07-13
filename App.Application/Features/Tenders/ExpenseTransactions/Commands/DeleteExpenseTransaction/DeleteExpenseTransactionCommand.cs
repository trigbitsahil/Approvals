using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.DeleteExpenseTransaction
{
    public class DeleteExpenseTransactionCommand : IRequest<DeleteExpenseTransactionCommandResponse>
    {
        public string ExpenseTransactionID { get; set; }
    }
}
