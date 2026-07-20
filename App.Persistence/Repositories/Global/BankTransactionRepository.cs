using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System.Data;

namespace OOH.Persistence.Repositories.Global
{
    public class BankTransactionRepository : BaseRepository<BankTransaction>, IBankTransactionRepository
    {
        public BankTransactionRepository(DapperDBContext dbContext) : base(dbContext)
        {
        }
    }
}
