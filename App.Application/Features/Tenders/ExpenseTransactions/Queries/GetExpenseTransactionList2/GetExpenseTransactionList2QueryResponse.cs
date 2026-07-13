using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList2
{
    public class GetExpenseTransactionList2QueryResponse : BaseResponse
    {

        public GetExpenseTransactionList2QueryResponse() : base()
        {

        }

        public List<ExpenseTransactionList2VM> Data { get; set; } = default!;

    }
}