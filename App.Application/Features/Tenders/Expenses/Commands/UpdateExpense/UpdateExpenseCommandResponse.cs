using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Expenses.Commands.UpdateExpense
{
    public class UpdateExpenseCommandResponse : BaseResponse
    {

        public UpdateExpenseCommandResponse() : base()
        {

        }

        public UpdateExpenseDto Data { get; set; } = default!;

    }
}
