using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.Accounts.Queries.GetAccountList
{
    public class GetAccountListQueryValidator : AbstractValidator<GetAccountListQuery>
    {
        private readonly IAccountRepository _AccountRepository;
        public GetAccountListQueryValidator(IAccountRepository AccountRepository)
        {

            _AccountRepository = AccountRepository;

            RuleFor(r => r.CategoryID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
