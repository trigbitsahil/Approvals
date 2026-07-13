using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Queries.GetExpenseCategoryDetail
{
    public class GetExpenseCategoryDetailQuery : IRequest<GetExpenseCategoryDetailQueryResponse>
    {
        public string ExpenseCategoryId { get; set; }
    }
}
