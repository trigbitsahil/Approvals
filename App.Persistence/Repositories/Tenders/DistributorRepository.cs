using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Persistence.Repositories.Tenders
{
    public class DistributorRepository : BaseRepository<Distributor>, IDistributorRepository
    {
        public DistributorRepository(DapperDBContext dbContext) : base(dbContext)
        {
        }
    }
}
