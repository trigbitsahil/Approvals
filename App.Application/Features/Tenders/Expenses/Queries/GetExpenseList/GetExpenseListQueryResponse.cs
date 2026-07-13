using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseList
{
    public class GetExpenseListQueryResponse : BaseResponse
    {

        public GetExpenseListQueryResponse() : base()
        {

        }

        public List<ExpenseListVM> Data { get; set; } = default!;

    }
}