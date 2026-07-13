using MediatR;

namespace OOH.Application.Features.Global.Customers.Queries.GetCustomerDetail
{
    public class GetCustomerDetailQuery : IRequest<GetCustomerDetailQueryResponse>
    {
        public string CustomerId { get; set; }
    }
}
