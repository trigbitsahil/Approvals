using MediatR;

namespace OOH.Application.Features.Tenders.Vendors.Commands.UpdateVendor
{
    public class UpdateVendorCommand : IRequest<UpdateVendorCommandResponse>
    {
   

 
        public string VendorID { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }


        public string Phone { get; set; }


        public string Website { get; set; }


        public string GstNumber { get; set; }


        public string PanNumber { get; set; }


        public string Address { get; set; }


        public string Note { get; set; }

        public string VendorCategoryId { get; set; }
    }
}
