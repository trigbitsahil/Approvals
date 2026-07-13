using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionSearch
{
    public class GetExpenseTransactionSearchQuery : IRequest<GetExpenseTransactionSearchQueryResponse>
    {
        public string MediaIds { get; set; }
        public string ExpenseId { get; set; }
        public string ExpenseTypeId { get; set; }

        public string VendorId { get; set; }


        

    }
}
