using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Vendors.Commands.DeleteVendor
{
    public class DeleteVendorCommandResponse : BaseResponse
    {

        public DeleteVendorCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
