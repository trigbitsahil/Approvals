using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.CreateExpenseCategory
{
    public class CreateExpenseCategoryCommandResponse : BaseResponse
    {

        public CreateExpenseCategoryCommandResponse() : base()
        {

        }

        public CreateExpenseCategoryDto Data { get; set; } = default!;

    }
}
