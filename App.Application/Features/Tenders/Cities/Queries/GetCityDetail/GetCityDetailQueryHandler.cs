using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
 
using OOH.Domain.Entities.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Queries.GetCityDetail
{


    public class GetCityDetailQueryHandler :
     IRequestHandler<GetCityDetailQuery, GetCityDetailQueryResponse>
    {

        private readonly ICityRepository _cityRepository;

        private readonly IMapper _mapper;
        public GetCityDetailQueryHandler(IMapper mapper, ICityRepository cityRepository)
        {
            _mapper = mapper;
            _cityRepository = cityRepository;
        }



        public async Task<GetCityDetailQueryResponse> Handle(GetCityDetailQuery request, CancellationToken cancellationToken)
        {

            GetCityDetailQueryResponse gGetCityDetailQueryResponse = new GetCityDetailQueryResponse();

            var validator = new GetCityDetailQueryValidator(_cityRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                gGetCityDetailQueryResponse.Success = false;
                gGetCityDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    gGetCityDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (gGetCityDetailQueryResponse.Success)
            {

                City entity = await _cityRepository.GetByIdAsync(request.CityID);



                if (entity == null)
                {
                    gGetCityDetailQueryResponse.Success = false;

                }
                else
                {
                    gGetCityDetailQueryResponse.Data = _mapper.Map<CityDetailVM>(entity);

                }

            }


            return gGetCityDetailQueryResponse;



        }


    }
}
