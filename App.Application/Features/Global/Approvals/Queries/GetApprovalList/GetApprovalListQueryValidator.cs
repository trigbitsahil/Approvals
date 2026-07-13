using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalList
{
    public class GetApprovalListQueryValidator : AbstractValidator<GetApprovalListQuery>
    {
        private readonly IApprovalRepository _ApprovalRepository;
        public GetApprovalListQueryValidator(IApprovalRepository ApprovalRepository)
        {

            _ApprovalRepository = ApprovalRepository;

            RuleFor(r => r.CategoryID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
