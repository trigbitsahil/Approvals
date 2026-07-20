using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System.Data;

namespace OOH.Persistence.Repositories.Global
{
    public class BankRepository : BaseRepository<Bank>, IBankRepository
    {
        public BankRepository(DapperDBContext dbContext) : base(dbContext)
        {
        }
    }
}
