using OOH.Application.Features.Tenders.ExpenseTypes.Queries.GetExpenseTypeList;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Contracts.Persistence.Tenders
{

    public interface IExpenseTypeRepository : IAsyncRepository<ExpenseType>
    {
        Task<List<ExpenseTypeListVM>> ListAllExpenseTypesAsync( );
    }

}
