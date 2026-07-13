using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Customers.Queries.GetCustomerDetail
{
    public class GetCustomerDetailQueryResponse : BaseResponse
    {

        public GetCustomerDetailQueryResponse() : base()
        {

        }

        public CustomerDetailVM Data { get; set; } = default!;

    }
}
