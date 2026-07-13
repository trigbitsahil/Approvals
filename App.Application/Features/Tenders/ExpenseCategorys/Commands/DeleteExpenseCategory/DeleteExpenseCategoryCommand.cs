using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.DeleteExpenseCategory
{
    public class DeleteExpenseCategoryCommand : IRequest<DeleteExpenseCategoryCommandResponse>
    {
        public string ExpenseCategoryId { get; set; }
    }
}
