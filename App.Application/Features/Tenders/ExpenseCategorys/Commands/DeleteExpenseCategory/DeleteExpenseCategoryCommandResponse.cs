using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.DeleteExpenseCategory
{
    public class DeleteExpenseCategoryCommandResponse : BaseResponse
    {

        public DeleteExpenseCategoryCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
