using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionById
{
    public class GetBankTransactionByIdQueryValidator : AbstractValidator<GetBankTransactionByIdQuery>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;

        public GetBankTransactionByIdQueryValidator(IBankTransactionRepository bankTransactionRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;

            RuleFor(r => r.BankId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull()
                .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");
        }
    }
}
