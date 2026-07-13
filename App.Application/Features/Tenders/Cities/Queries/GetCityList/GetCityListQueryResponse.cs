using OOH.Application.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Queries.GetCityList
{
 
    public class GetCityListQueryResponse : BaseResponse
    {

        public GetCityListQueryResponse() : base()
        {

        }

        public List<CityListVM> Data { get; set; } = default!;

    }
}
