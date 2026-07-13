using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.UpdateExpenseCategory
{
    public class UpdateExpenseCategoryCommand : IRequest<UpdateExpenseCategoryCommandResponse>
    {


        public string ExpenseCategoryId { get; set; }

        public string Name { get; set; }
         


    }
}
