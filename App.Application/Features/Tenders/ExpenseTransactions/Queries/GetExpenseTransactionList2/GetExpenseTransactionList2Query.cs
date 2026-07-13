using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList2
{
    public class GetExpenseTransactionList2Query : IRequest<GetExpenseTransactionList2QueryResponse>
    {
        public string Category { get; set; }

        public string CategoryID { get; set; }

    }
}
