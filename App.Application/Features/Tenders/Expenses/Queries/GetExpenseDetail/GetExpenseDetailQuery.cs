using MediatR;

namespace OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseDetail
{
    public class GetExpenseDetailQuery : IRequest<GetExpenseDetailQueryResponse>
    {
        public string ExpenseID { get; set; }
    }
}
