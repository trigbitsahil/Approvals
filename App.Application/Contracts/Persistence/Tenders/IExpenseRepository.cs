using OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseList;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Contracts.Persistence.Tenders
{

    public interface IExpenseRepository : IAsyncRepository<Expense>
    {
        Task<List<ExpenseListVM>> ListAllExpensesAsync(string? expenseTypeID = null);
    }

}
