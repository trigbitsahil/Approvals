using Dapper;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OOH.Persistence.Repositories
{
    public class ContractRepository : BaseRepository<Contract>, IContractRepository
    {
        public ContractRepository(DapperDBContext dbContext) : base(dbContext)
        {
        }
    }
}
