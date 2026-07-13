namespace OOH.Application.Features.Global.Customers.Commands.UpdateCustomer
{
    public class UpdateCustomerDto
    {
 
        public string CustomerId { get; set; }
 
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
 
        public bool IsVoided { get; set; }
 
        public string CreatedBy { get; set; }
   
        public DateTime CreatedDate { get; set; }
 
        public string LastModifiedBy { get; set; }
 
        public DateTime? LastModifiedDate { get; set; }
 


    }
}
