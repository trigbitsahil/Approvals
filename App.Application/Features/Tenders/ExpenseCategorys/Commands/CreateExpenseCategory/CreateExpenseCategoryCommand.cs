using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.CreateExpenseCategory
{
    public class CreateExpenseCategoryCommand : IRequest<CreateExpenseCategoryCommandResponse>
    {


 

        public string Name { get; set; }
         



    }
}
