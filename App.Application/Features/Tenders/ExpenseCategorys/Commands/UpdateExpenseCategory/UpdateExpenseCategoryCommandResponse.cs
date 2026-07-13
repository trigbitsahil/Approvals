using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.UpdateExpenseCategory
{
    public class UpdateExpenseCategoryCommandResponse : BaseResponse
    {

        public UpdateExpenseCategoryCommandResponse() : base()
        {

        }

        public UpdateExpenseCategoryDto Data { get; set; } = default!;

    }
}
