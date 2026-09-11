using MediatR;

namespace OOH.Application.Features.Tenders.Vendors.Queries.GetVendorSummary
{
    public class GetVendorSummaryQuery : IRequest<GetVendorSummaryQueryResponse>
    {
        public string VendorId { get; set; }
    }
}
