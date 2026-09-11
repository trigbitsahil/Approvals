using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Distributors.Commands.DeleteDistributor
{
    public class DeleteDistributorCommandValidator : AbstractValidator<DeleteDistributorCommand>
    {
        private readonly IDistributorRepository _distributorRepository;

        public DeleteDistributorCommandValidator(IDistributorRepository distributorRepository)
        {
            _distributorRepository = distributorRepository;

            RuleFor(p => p.DistributorId)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .NotNull();
        }
    }
}
