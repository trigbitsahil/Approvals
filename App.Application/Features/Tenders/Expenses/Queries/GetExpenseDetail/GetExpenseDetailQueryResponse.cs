using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseDetail
{
    public class GetExpenseDetailQueryResponse : BaseResponse
    {

        public GetExpenseDetailQueryResponse() : base()
        {

        }

        public ExpenseDetailVM Data { get; set; } = default!;

    }
}
