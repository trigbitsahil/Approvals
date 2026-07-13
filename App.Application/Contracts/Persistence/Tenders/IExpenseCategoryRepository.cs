using OOH.Application.Features.Tenders.ExpenseCategorys.Queries.GetExpenseCategoryList;
using OOH.Domain.Entities;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Contracts.Persistence.Tenders
{

    public interface IExpenseCategoryRepository : IAsyncRepository<ExpenseCategory>
    {
        Task<List<ExpenseCategoryListVM>> ListAllExpenseCategorysAsync(string category, string categoryID);
    }

}
