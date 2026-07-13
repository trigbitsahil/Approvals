using OOH.Application.Features.Tenders.Vendors.Queries.GetVendorList;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Contracts.Persistence.Tenders
{

    public interface IVendorRepository : IAsyncRepository<Vendor>
    {
        Task<List<VendorListVM>> ListAllVendorsAsync(string category, string categoryID);
    }

}
