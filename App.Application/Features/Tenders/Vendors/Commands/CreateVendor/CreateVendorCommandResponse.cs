using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Vendors.Commands.CreateVendor
{
    public class CreateVendorCommandResponse : BaseResponse
    {

        public CreateVendorCommandResponse() : base()
        {

        }

        public CreateVendorDto Data { get; set; } = default!;

    }
}
