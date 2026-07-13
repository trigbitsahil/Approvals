using OOH.Application.Features.Global.Accounts.Queries.GetAccountList;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Contracts.Persistence
{

    public interface IAccountRepository : IAsyncRepository<Account>
    {
        Task<List<AccountListVM>> ListAllAccountsAsync(string category, string categoryID);
    }

}
