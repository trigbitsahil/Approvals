using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDebtorId
{
    public class GetBankTransactionsByDebtorIdQueryValidator : AbstractValidator<GetBankTransactionsByDebtorIdQuery>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;

        public GetBankTransactionsByDebtorIdQueryValidator(IBankTransactionRepository bankTransactionRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;

            RuleFor(r => r.DebtorId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull()
                .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");
        }
    }
}
