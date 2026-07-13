using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Queries.GetExpenseTypeDetail
{
    public class GetExpenseTypeDetailQuery : IRequest<GetExpenseTypeDetailQueryResponse>
    {
        public string ExpenseTypeID { get; set; }
    }
}
