using AutoMapper;
using FluentValidation.Validators;
using MediatR;
using Microsoft.Extensions.Options;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Features.Tenders.Cities.Queries.GetCityList;
 
using OOH.Application.Models.Mail;
using OOH.Domain;
using OOH.Domain.Entities;
using OOH.Domain.Entities.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Commands.CreateCity
{
    public class CreateCityCommandHandler : IRequestHandler<CreateCityCommand, CreateCityCommandResponse>
    {
        private readonly ICityRepository _cityRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        public CreateCityCommandHandler(IMapper mapper, ICityRepository cityRepository, IEmailService emailService)
        {
            _mapper = mapper;
            _cityRepository = cityRepository;
            _emailService = emailService;
        }




        public async Task<CreateCityCommandResponse> Handle(CreateCityCommand request, CancellationToken cancellationToken)
        {

            var createCtyCommandResponse = new CreateCityCommandResponse();

            var validator = new CreateCityCommandValidator(_cityRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createCtyCommandResponse.Success = false;
                createCtyCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createCtyCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createCtyCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.City, DateTime.Now, System.Guid.NewGuid().ToString());

                var city = new City()
                {
                    CityId = entityKeyColumnValue,
                    Name = request.Name,

                };
                int i = await _cityRepository.AddAsync(city);

                if (i == -1)
                {
                    createCtyCommandResponse.Success = false;

                }
                else
                {
                    createCtyCommandResponse.Data = _mapper.Map<CreateCityDto>(city);

                }

            }


            return createCtyCommandResponse;



        }


    }
}
