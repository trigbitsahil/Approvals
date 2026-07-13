using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
 
using OOH.Domain.Entities.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Commands.DeleteCity
{

    public class DeleteCityCommandHandler :
       IRequestHandler<DeleteCityCommand, DeleteCityCommandResponse>
    {
        private readonly ICityRepository _cityRepository;


        private readonly IMapper _mapper;
        public DeleteCityCommandHandler(IMapper mapper, ICityRepository cityRepository)
        {
            _mapper = mapper;
            _cityRepository = cityRepository;
        }



        public async Task<DeleteCityCommandResponse> Handle(DeleteCityCommand request, CancellationToken cancellationToken)
        {

            DeleteCityCommandResponse deleteCityCommandResponse = new DeleteCityCommandResponse();

            var validator = new DeleteCityCommandValidator(_cityRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteCityCommandResponse.Success = false;
                deleteCityCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteCityCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteCityCommandResponse.Success)
            {

                City entity = await _cityRepository.GetByIdAsync(request.CityID);

                int result;


                if (entity == null)
                {
                    deleteCityCommandResponse.Success = false;

                    deleteCityCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _cityRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteCityCommandResponse.Success = false;

                        deleteCityCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteCityCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteCityCommandResponse;



        }


    }
}
