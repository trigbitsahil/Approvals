using OOH.Domain.Entities.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Contracts.Persistence.Tenders
{
    public interface IGovtBodyRepository : IAsyncRepository<GovtBody>
    {
        //Task<bool> IsNameUnique(string name);
        Task<bool> IsNameUnique(string name, string id = null);

    }
}
