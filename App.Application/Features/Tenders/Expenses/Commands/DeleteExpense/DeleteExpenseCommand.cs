using MediatR;

namespace OOH.Application.Features.Tenders.Expenses.Commands.DeleteExpense
{
    public class DeleteExpenseCommand : IRequest<DeleteExpenseCommandResponse>
    {
        public string ExpenseID { get; set; }
    }
}
