using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Customers.Commands.CreateCustomer
{
    public class CreateCustomerCommandResponse : BaseResponse
    {

        public CreateCustomerCommandResponse() : base()
        {

        }

        public CreateCustomerDto Data { get; set; } = default!;

    }
}
