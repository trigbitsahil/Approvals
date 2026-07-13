using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail
{
    public class GetExpenseTransactionDetailQueryResponse : BaseResponse
    {

        public GetExpenseTransactionDetailQueryResponse() : base()
        {

        }

        public ExpenseTransactionDetailVM Data { get; set; } = default!;

    }
}
