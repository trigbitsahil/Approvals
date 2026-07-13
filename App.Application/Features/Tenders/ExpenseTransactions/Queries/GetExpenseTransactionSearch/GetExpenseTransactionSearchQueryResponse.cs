using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionSearch
{
    public class GetExpenseTransactionSearchQueryResponse : BaseResponse
    {

        public GetExpenseTransactionSearchQueryResponse() : base()
        {

        }

        public List<ExpenseTransactionSearchVM> Data { get; set; } = default!;

    }
}