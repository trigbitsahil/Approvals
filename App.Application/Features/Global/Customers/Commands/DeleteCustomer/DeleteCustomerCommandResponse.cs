using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Customers.Commands.DeleteCustomer
{
    public class DeleteCustomerCommandResponse : BaseResponse
    {

        public DeleteCustomerCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
