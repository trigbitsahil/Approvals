using MediatR;

namespace OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseList
{
    public class GetExpenseListQuery : IRequest<GetExpenseListQueryResponse>
    {
        
        public string? ExpenseTypeID { get; set; }

    }
}
