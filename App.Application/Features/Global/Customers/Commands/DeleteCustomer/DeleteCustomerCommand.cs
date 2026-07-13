using MediatR;

namespace OOH.Application.Features.Global.Customers.Commands.DeleteCustomer
{
    public class DeleteCustomerCommand : IRequest<DeleteCustomerCommandResponse>
    {
        public string CustomerId { get; set; }
    }
}
