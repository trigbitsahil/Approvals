using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Vendors.Queries.GetVendorSummary
{
    public class GetVendorSummaryQueryResponse : BaseResponse
    {
        public GetVendorSummaryQueryResponse() : base() { }
        public VendorSummaryVM Data { get; set; }
    }
}
