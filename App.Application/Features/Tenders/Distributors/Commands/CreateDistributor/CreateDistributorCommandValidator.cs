using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Distributors.Commands.CreateDistributor
{
    public class CreateDistributorCommandValidator : AbstractValidator<CreateDistributorCommand>
    {
        private readonly IDistributorRepository _distributorRepository;

        public CreateDistributorCommandValidator(IDistributorRepository distributorRepository)
        {
            _distributorRepository = distributorRepository;

            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .NotNull();
        }
    }
}
