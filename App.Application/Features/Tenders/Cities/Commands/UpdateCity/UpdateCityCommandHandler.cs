using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Exceptions;
 
using OOH.Domain.Entities.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Commands.UpdateCity
{

    public class UpdateCityCommandHandler : IRequestHandler<UpdateCityCommand, UpdateCityCommandResponse>
    {
        private readonly ICityRepository  _cityRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateCityCommandHandler(IMapper mapper, ICityRepository cityRepository)
        {
            _mapper = mapper;
            _cityRepository = cityRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateCityCommandResponse> Handle(UpdateCityCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _cityRepository.GetByIdAsync(request.CityID);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(City), request.CityID);
            }



            var updateCityCommandResponse = new UpdateCityCommandResponse();

            var validator = new UpdateCityCommandValidator(_cityRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateCityCommandResponse.Success = false;
                updateCityCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateCityCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateCityCommandResponse.Success)
            {
                //  string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.GovtBody, DateTime.Now, System.Guid.NewGuid().ToString());

                //var govtBody = new Domain.Entities.GovtBody()
                //{
                //    GovtBodyID = request.GovtBodyID,
                //    Name = request.Name,
                //    LastModifiedDate = DateTime.UtcNow,
                //    LastModifiedBy = "taran"

                //};
                _mapper.Map(request, recordToUpdate, typeof(UpdateCityCommand), typeof(City));

              
                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _cityRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateCityCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    updateCityCommandResponse.Data = _mapper.Map<UpdateCityDto>(recordToUpdate);

                }
                //var email = new Email() { To = "iamtaranpanesar@gmail.com", Body = $"A new event was created: {request}", Subject = "A new event was created" };

                //try
                //{
                //    await _emailService.SendEmail(email);
                //}
                //catch (Exception ex)
                //{
                //    //this shouldn't stop the API from doing else so this can be logged
                //    // _logger.LogError($"Mailing about event {@event.EventId} failed due to an error with the mail service: {ex.Message}");
                //}
            }
            // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();


            //    city = await _cityRepository.AddAsync(city);

            // return city.Id;

            return updateCityCommandResponse;



        }

    }
}
