using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorSummary
{
    public class GetDistributorSummaryQueryResponse : BaseResponse
    {
        public DistributorSummaryVM Data { get; set; }
    }
}
