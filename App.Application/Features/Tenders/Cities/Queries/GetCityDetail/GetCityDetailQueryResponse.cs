using OOH.Application.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Queries.GetCityDetail
{
    public class GetCityDetailQueryResponse : BaseResponse
    {

        public GetCityDetailQueryResponse() : base()
        {

        }

        public CityDetailVM Data { get; set; } = default!;

    }
}
