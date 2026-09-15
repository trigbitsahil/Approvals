using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Debtors.Commands.UpdateDebtor
{
    public class UpdateDebtorCommandValidator : AbstractValidator<UpdateDebtorCommand>
    {
        private readonly IDebtorRepository _debtorRepository;
        public UpdateDebtorCommandValidator(IDebtorRepository debtorRepository)
        {
            _debtorRepository = debtorRepository;
            RuleFor(r => r.DebtorId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull();
            RuleFor(r => r.Name)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull();
        }
    }
}
