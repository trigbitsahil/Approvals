using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Customers.Queries.GetCustomerList
{
    public class GetCustomerListQueryResponse : BaseResponse
    {

        public GetCustomerListQueryResponse() : base()
        {

        }

        public List<CustomerListVM> Data { get; set; } = default!;

    }
}