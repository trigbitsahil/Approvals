using MediatR;
using OOH.Application.Features.Tenders.Cities.Commands.CreateCity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Commands.CreateCity
{
    public class CreateCityCommand : IRequest<CreateCityCommandResponse>
    {
        public string Name { get; set; }
    }
}
