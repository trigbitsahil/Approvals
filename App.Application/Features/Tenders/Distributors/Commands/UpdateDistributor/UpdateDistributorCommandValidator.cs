using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Distributors.Commands.UpdateDistributor
{
    public class UpdateDistributorCommandValidator : AbstractValidator<UpdateDistributorCommand>
    {
        private readonly IDistributorRepository _distributorRepository;

        public UpdateDistributorCommandValidator(IDistributorRepository distributorRepository)
        {
            _distributorRepository = distributorRepository;

            RuleFor(p => p.DistributorId)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .NotNull();

            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .NotNull();
        }
    }
}
