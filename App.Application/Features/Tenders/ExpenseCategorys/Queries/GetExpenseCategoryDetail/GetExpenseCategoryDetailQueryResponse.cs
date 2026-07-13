using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Queries.GetExpenseCategoryDetail
{
    public class GetExpenseCategoryDetailQueryResponse : BaseResponse
    {

        public GetExpenseCategoryDetailQueryResponse() : base()
        {

        }

        public ExpenseCategoryDetailVM Data { get; set; } = default!;

    }
}
