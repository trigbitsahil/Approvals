using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Commands.CreateCity
{
    public class CreateCityCommandValidator : AbstractValidator<CreateCityCommand>
    {
        private readonly ICityRepository _cityRepository;
        public CreateCityCommandValidator(ICityRepository cityRepository)
        {
            _cityRepository = cityRepository;

            RuleFor(r => r.Name)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");


            RuleFor(e => e)
             .MustAsync(CityNameUnique)
             .WithMessage("An event with the same name and date already exists.");



        }
        private async Task<bool> CityNameUnique(CreateCityCommand e, CancellationToken token)
        {
            return !await _cityRepository.IsCityNameUnique(e.Name);
        }


    }
}
