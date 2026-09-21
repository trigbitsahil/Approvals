using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByVendorId
{
    public class GetBankTransactionsByVendorIdQueryValidator : AbstractValidator<GetBankTransactionsByVendorIdQuery>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;

        public GetBankTransactionsByVendorIdQueryValidator(IBankTransactionRepository bankTransactionRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;

            RuleFor(r => r.VendorId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull()
                .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");
        }
    }
}
