using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Queries.GetExpenseTypeList
{
    public class GetExpenseTypeListQueryResponse : BaseResponse
    {

        public GetExpenseTypeListQueryResponse() : base()
        {

        }

        public List<ExpenseTypeListVM> Data { get; set; } = default!;

    }
}