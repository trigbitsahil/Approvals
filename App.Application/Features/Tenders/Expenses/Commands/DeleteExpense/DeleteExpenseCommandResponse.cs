using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Expenses.Commands.DeleteExpense
{
    public class DeleteExpenseCommandResponse : BaseResponse
    {

        public DeleteExpenseCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
