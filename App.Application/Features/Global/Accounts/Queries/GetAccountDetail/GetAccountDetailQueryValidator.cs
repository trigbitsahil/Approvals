using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.Accounts.Queries.GetAccountDetail
{
    public class GetAccountDetailQueryValidator : AbstractValidator<GetAccountDetailQuery>
    {
        private readonly IAccountRepository _AccountRepository;
        public GetAccountDetailQueryValidator(IAccountRepository AccountRepository)
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
