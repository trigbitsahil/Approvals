using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.DeleteExpenseTransaction
{
    public class DeleteExpenseTransactionCommandResponse : BaseResponse
    {

        public DeleteExpenseTransactionCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
