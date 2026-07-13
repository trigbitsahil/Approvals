using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListByVendor
{
    public class GetExpenseTransactionListByVendorQueryResponse : BaseResponse
    {

        public GetExpenseTransactionListByVendorQueryResponse() : base()
        {

        }

        public List<ExpenseTransactionListByVendorVM> Data { get; set; } = default!;

    }
}