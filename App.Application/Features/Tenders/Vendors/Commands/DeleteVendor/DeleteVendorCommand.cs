using MediatR;

namespace OOH.Application.Features.Tenders.Vendors.Commands.DeleteVendor
{
    public class DeleteVendorCommand : IRequest<DeleteVendorCommandResponse>
    {
        public string VendorID { get; set; }
    }
}
