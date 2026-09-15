using FluentValidation;

namespace OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorDetail
{
    public class GetDistributorDetailQueryValidator : AbstractValidator<GetDistributorDetailQuery>
    {
        public GetDistributorDetailQueryValidator()
        {
            RuleFor(p => p.DistributorID)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .NotNull();
        }
    }
}
