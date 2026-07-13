using MediatR;

namespace OOH.Application.Features.Global.Customers.Commands.CreateCustomer
{
    public class CreateCustomerCommand : IRequest<CreateCustomerCommandResponse>
    {

 

        public string CompanyName { get; set; }

        public string Description { get; set; }

        public string Status { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string? Email { get; set; }

        public string Phone { get; set; }

        public string? PaymentTerms { get; set; }

        public string? TaxId { get; set; }

        public string? AddressId { get; set; }


        public bool IsActive { get; set; }




    }
}
