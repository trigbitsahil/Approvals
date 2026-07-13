using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;
 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Queries.GetCityDetail
{

    public class GetCityDetailQueryValidator : AbstractValidator<GetCityDetailQuery>
    {
        private readonly ICityRepository _cityRepository;
        public GetCityDetailQueryValidator(ICityRepository cityRepository)
        {

            _cityRepository = cityRepository;

            RuleFor(r => r.CityID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
