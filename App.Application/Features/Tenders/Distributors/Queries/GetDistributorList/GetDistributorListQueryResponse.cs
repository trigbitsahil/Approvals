using OOH.Application.Responses;
using System.Collections.Generic;

namespace OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorList
{
    public class GetDistributorListQueryResponse : BaseResponse
    {
        public GetDistributorListQueryResponse() : base()
        {
        }

        public List<DistributorListVM> Data { get; set; }
    }
}
