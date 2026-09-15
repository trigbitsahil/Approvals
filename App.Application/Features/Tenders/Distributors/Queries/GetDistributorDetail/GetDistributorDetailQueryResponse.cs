using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorDetail
{
    public class GetDistributorDetailQueryResponse : BaseResponse
    {
        public GetDistributorDetailQueryResponse() : base()
        {
        }

        public DistributorDetailVM Data { get; set; }
    }
}
