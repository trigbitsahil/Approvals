using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList
{
    public class GetExpenseTransactionListQueryResponse : BaseResponse
    {

        public GetExpenseTransactionListQueryResponse() : base()
        {

        }

        public List<ExpenseTransactionListVM> Data { get; set; } = default!;

    }
}