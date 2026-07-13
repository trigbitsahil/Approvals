using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.UpdateExpenseTransaction
{
    public class UpdateExpenseTransactionCommandResponse : BaseResponse
    {

        public UpdateExpenseTransactionCommandResponse() : base()
        {

        }

        public UpdateExpenseTransactionDto Data { get; set; } = default!;

    }
}
