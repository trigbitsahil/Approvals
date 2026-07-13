using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.CreateExpenseTransaction
{
    public class CreateExpenseTransactionCommandResponse : BaseResponse
    {

        public CreateExpenseTransactionCommandResponse() : base()
        {

        }

        public CreateExpenseTransactionDto Data { get; set; } = default!;

    }
}
