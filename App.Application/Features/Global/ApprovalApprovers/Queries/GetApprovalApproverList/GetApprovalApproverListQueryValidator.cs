using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverList
{
    public class GetApprovalApproverListQueryValidator : AbstractValidator<GetApprovalApproverListQuery>
    {
        private readonly IApprovalApproverRepository _ApprovalApproverRepository;
        public GetApprovalApproverListQueryValidator(IApprovalApproverRepository ApprovalApproverRepository)
        {

            _ApprovalApproverRepository = ApprovalApproverRepository;

            RuleFor(r => r.ApprovalID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
