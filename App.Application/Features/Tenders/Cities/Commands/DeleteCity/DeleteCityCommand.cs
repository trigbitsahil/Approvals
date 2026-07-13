using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Commands.DeleteCity
{
   
     public class DeleteCityCommand : IRequest<DeleteCityCommandResponse>
    {
        public string CityID { get; set; }
    }
}
