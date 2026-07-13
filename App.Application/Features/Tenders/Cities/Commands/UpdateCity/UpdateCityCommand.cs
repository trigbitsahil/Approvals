using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Commands.UpdateCity
{
 
     public class UpdateCityCommand : IRequest<UpdateCityCommandResponse>
    {

        public string CityID { get; set; }
        public string Name { get; set; }
    }
}
