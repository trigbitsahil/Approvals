using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusDetail
{
    public class GetApprovalStatusDetailQueryValidator : AbstractValidator<GetApprovalStatusDetailQuery>
    {
        private readonly IApprovalStatusRepository _ApprovalStatusRepository;
        public GetApprovalStatusDetailQueryValidator(IApprovalStatusRepository ApprovalStatusRepository)
        {

            _ApprovalStatusRepository = ApprovalStatusRepository;

            RuleFor(r => r.ApprovalStatusID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
