using MediatR;

namespace OOH.Application.Features.Tenders.Vendors.Queries.GetVendorDetail
{
    public class GetVendorDetailQuery : IRequest<GetVendorDetailQueryResponse>
    {
        public string VendorID { get; set; }
    }
}
