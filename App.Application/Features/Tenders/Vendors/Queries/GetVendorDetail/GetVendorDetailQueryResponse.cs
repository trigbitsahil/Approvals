using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Vendors.Queries.GetVendorDetail
{
    public class GetVendorDetailQueryResponse : BaseResponse
    {

        public GetVendorDetailQueryResponse() : base()
        {

        }

        public VendorDetailVM Data { get; set; } = default!;

    }
}
