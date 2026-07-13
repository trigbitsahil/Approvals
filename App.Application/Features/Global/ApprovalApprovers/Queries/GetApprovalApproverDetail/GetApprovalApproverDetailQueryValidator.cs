using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverDetail
{
    public class GetApprovalApproverDetailQueryValidator : AbstractValidator<GetApprovalApproverDetailQuery>
    {
        private readonly IApprovalApproverRepository _ApprovalApproverRepository;
        public GetApprovalApproverDetailQueryValidator(IApprovalApproverRepository ApprovalApproverRepository)
        {

            _ApprovalApproverRepository = ApprovalApproverRepository;

            RuleFor(r => r.ApprovalApproverID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
