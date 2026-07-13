using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.CreateExpenseType
{
    public class CreateExpenseTypeCommand : IRequest<CreateExpenseTypeCommandResponse>
    {


  
        public string Name { get; set; }

        public string ExpenseCategoryId{ get; set; }




    }
}
