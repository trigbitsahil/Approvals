using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Queries.GetCityDetail
{
     
   public class GetCityDetailQuery : IRequest<GetCityDetailQueryResponse>
    {
        public string CityID { get; set; }
    }
}
