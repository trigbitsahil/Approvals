using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Debtors.Commands.CreateDebtor
{
    public class CreateDebtorCommandValidator : AbstractValidator<CreateDebtorCommand>
    {
        private readonly IDebtorRepository _debtorRepository;
        public CreateDebtorCommandValidator(IDebtorRepository debtorRepository)
        {
            _debtorRepository = debtorRepository;
            RuleFor(r => r.Name)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull();
        }
    }
}
