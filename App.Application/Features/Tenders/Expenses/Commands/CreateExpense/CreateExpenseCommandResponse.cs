using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Expenses.Commands.CreateExpense
{
    public class CreateExpenseCommandResponse : BaseResponse
    {

        public CreateExpenseCommandResponse() : base()
        {

        }

        public CreateExpenseDto Data { get; set; } = default!;

    }
}
