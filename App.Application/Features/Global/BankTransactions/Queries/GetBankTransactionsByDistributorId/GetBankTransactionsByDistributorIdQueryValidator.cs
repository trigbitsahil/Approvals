using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDistributorId
{
    public class GetBankTransactionsByDistributorIdQueryValidator : AbstractValidator<GetBankTransactionsByDistributorIdQuery>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;

        public GetBankTransactionsByDistributorIdQueryValidator(IBankTransactionRepository bankTransactionRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;

            RuleFor(r => r.DistributorId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull()
                .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");
        }
    }
}
