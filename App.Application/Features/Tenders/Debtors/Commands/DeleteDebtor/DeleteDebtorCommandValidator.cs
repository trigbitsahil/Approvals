using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Debtors.Commands.DeleteDebtor
{
    public class DeleteDebtorCommandValidator : AbstractValidator<DeleteDebtorCommand>
    {
        private readonly IDebtorRepository _debtorRepository;
        public DeleteDebtorCommandValidator(IDebtorRepository debtorRepository)
        {
            _debtorRepository = debtorRepository;
            RuleFor(r => r.DebtorId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull();
        }
    }
}
