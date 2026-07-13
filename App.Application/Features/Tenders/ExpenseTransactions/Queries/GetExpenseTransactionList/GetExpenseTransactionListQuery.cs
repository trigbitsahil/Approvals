using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList
{
    public class GetExpenseTransactionListQuery : IRequest<GetExpenseTransactionListQueryResponse>
    {
        public string Category { get; set; }

        public string CategoryID { get; set; }

    }
}
