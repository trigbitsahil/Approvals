using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListByVendor
{
    public class GetExpenseTransactionListByVendorQuery : IRequest<GetExpenseTransactionListByVendorQueryResponse>
    {
        public string MediaId { get; set; }

        public string VendorId { get; set; }

    }
}
