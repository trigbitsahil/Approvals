using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Queries.GetExpenseCategoryList
{
    public class GetExpenseCategoryListQueryResponse : BaseResponse
    {

        public GetExpenseCategoryListQueryResponse() : base()
        {

        }

        public List<ExpenseCategoryListVM> Data { get; set; } = default!;

    }
}