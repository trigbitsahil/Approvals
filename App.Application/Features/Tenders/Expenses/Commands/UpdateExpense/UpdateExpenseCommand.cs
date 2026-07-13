using MediatR;

namespace OOH.Application.Features.Tenders.Expenses.Commands.UpdateExpense
{
    public class UpdateExpenseCommand : IRequest<UpdateExpenseCommandResponse>
    {
   

 

        public string ExpenseID { get; set; }

        public string ExpenseTypeId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

  



    }
}
