using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Customers.Commands.UpdateCustomer
{
    public class UpdateCustomerCommandResponse : BaseResponse
    {

        public UpdateCustomerCommandResponse() : base()
        {

        }

        public UpdateCustomerDto Data { get; set; } = default!;

    }
}
