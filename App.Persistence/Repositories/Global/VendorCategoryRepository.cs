using Dapper;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OOH.Persistence.Repositories
{
    public class VendorCategoryRepository : BaseRepository<VendorCategory>, IVendorCategoryRepository
    {
        public VendorCategoryRepository(DapperDBContext dbContext) : base(dbContext)
        {
        }
    }
}
