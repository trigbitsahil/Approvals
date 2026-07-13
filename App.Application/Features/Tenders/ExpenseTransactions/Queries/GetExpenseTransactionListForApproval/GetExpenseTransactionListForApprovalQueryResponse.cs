using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListForApproval
{
    public class GetExpenseTransactionListForApprovalQueryResponse : BaseResponse
    {

        public GetExpenseTransactionListForApprovalQueryResponse() : base()
        {

        }

        public List<ExpenseTransactionListForApprovalVM> Data { get; set; } = default!;

    }
}