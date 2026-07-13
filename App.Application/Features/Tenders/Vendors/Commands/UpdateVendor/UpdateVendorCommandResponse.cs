using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Vendors.Commands.UpdateVendor
{
    public class UpdateVendorCommandResponse : BaseResponse
    {

        public UpdateVendorCommandResponse() : base()
        {

        }

        public UpdateVendorDto Data { get; set; } = default!;

    }
}
