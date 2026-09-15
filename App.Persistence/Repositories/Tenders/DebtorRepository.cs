using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Persistence.Repositories.Tenders
{
    public class DebtorRepository : BaseRepository<Debtor>, IDebtorRepository
    {
        public DebtorRepository(DapperDBContext dbContext) : base(dbContext)
        {
        }
    }
}
