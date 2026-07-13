using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail
{
    public class GetApprovalDetailQueryValidator : AbstractValidator<GetApprovalDetailQuery>
    {
        private readonly IApprovalRepository _ApprovalRepository;
        public GetApprovalDetailQueryValidator(IApprovalRepository ApprovalRepository)
        {

            _ApprovalRepository = ApprovalRepository;

            RuleFor(r => r.ApprovalID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
