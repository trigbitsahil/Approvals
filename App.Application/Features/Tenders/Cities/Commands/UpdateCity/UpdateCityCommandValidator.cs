using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Commands.UpdateCity
{



    public class UpdateCityCommandValidator : AbstractValidator<UpdateCityCommand>
    {
        private readonly ICityRepository _cityRepository;
        public UpdateCityCommandValidator(ICityRepository cityRepository)
        {

            _cityRepository = cityRepository;

            RuleFor(r => r.Name)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");


            RuleFor(e => e)
             .MustAsync(IsNameUnique)
             .WithMessage("A record with the same Name already exists.");



        }

        private async Task<bool> IsNameUnique(UpdateCityCommand e, CancellationToken token)
        {
            return !await _cityRepository.IsCityNameUnique(e.Name, e.CityID);
        }


    }
}
