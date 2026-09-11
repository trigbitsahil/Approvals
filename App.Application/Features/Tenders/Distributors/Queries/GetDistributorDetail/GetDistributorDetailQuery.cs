using MediatR;

namespace OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorDetail
{
    public class GetDistributorDetailQuery : IRequest<GetDistributorDetailQueryResponse>
    {
        public string DistributorID { get; set; }
    }
}
