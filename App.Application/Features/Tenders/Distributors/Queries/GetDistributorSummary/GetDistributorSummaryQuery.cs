using MediatR;

namespace OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorSummary
{
    public class GetDistributorSummaryQuery : IRequest<GetDistributorSummaryQueryResponse>
    {
        public string DistributorId { get; set; }
    }
}
