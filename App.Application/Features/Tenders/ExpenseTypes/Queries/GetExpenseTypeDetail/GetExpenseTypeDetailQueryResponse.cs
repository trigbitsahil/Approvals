using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Queries.GetExpenseTypeDetail
{
    public class GetExpenseTypeDetailQueryResponse : BaseResponse
    {

        public GetExpenseTypeDetailQueryResponse() : base()
        {

        }

        public ExpenseTypeDetailVM Data { get; set; } = default!;

    }
}
