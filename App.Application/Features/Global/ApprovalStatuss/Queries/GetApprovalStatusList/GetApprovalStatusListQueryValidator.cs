using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusList
{
    public class GetApprovalStatusListQueryValidator : AbstractValidator<GetApprovalStatusListQuery>
    {
        private readonly IApprovalStatusRepository _ApprovalStatusRepository;
        public GetApprovalStatusListQueryValidator(IApprovalStatusRepository ApprovalStatusRepository)
        {

            _ApprovalStatusRepository = ApprovalStatusRepository;

            //RuleFor(r => r.CategoryID)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
