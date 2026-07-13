using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.Accounts.Commands.DeleteAccount
{
    public class DeleteAccountCommandValidator : AbstractValidator<DeleteAccountCommand>
    {
        private readonly IAccountRepository _AccountRepository;
        public DeleteAccountCommandValidator(IAccountRepository AccountRepository)
        {

            _AccountRepository = AccountRepository;

            RuleFor(r => r.AccountID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
