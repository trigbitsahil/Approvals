using OOH.Application.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Commands.UpdateCity
{
 
 public class UpdateCityCommandResponse : BaseResponse
    {

        public UpdateCityCommandResponse() : base()
        {

        }

        public UpdateCityDto Data { get; set; } = default!;

    }
}
