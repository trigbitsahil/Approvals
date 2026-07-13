using OOH.Application.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Commands.CreateCity
{
    public class CreateCityCommandResponse : BaseResponse
    {

        public CreateCityCommandResponse() : base()
        {

        }

        public CreateCityDto Data { get; set; } = default!;

    }
}
