using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail
{
    public class GetExpenseTransactionDetailQuery : IRequest<GetExpenseTransactionDetailQueryResponse>
    {
        public string ExpenseTransactionID { get; set; }
    }
}
