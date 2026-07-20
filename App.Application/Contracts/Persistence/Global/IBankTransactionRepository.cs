using OOH.Domain.Entities.Global;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace OOH.Application.Contracts.Persistence
{
    public interface IBankTransactionRepository : IAsyncRepository<BankTransaction>
    {
    }
}
