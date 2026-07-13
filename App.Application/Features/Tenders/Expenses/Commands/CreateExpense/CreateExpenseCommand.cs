using MediatR;

namespace OOH.Application.Features.Tenders.Expenses.Commands.CreateExpense
{
    public class CreateExpenseCommand : IRequest<CreateExpenseCommandResponse>
    {

       
        public string ExpenseTypeId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

       





    }
}
