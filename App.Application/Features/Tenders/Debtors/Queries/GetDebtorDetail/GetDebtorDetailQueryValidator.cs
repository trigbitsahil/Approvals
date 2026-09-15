using FluentValidation;

namespace OOH.Application.Features.Tenders.Debtors.Queries.GetDebtorDetail
{
    public class GetDebtorDetailQueryValidator : AbstractValidator<GetDebtorDetailQuery>
    {
        public GetDebtorDetailQueryValidator()
        {
            RuleFor(r => r.DebtorID)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull();
        }
    }
}
