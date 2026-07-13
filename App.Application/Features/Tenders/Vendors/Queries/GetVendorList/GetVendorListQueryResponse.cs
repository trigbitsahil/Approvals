using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Vendors.Queries.GetVendorList
{
    public class GetVendorListQueryResponse : BaseResponse
    {

        public GetVendorListQueryResponse() : base()
        {

        }

        public List<VendorListVM> Data { get; set; } = default!;

    }
}