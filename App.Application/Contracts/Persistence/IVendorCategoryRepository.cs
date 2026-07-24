using OOH.Domain.Entities.Global;
using System.Threading.Tasks;

namespace OOH.Application.Contracts.Persistence
{
    public interface IVendorCategoryRepository : IAsyncRepository<VendorCategory>
    {
    }
}
