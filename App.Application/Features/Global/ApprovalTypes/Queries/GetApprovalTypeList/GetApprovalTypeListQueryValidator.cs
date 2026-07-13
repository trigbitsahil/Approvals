using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeList
{
    public class GetApprovalTypeListQueryValidator : AbstractValidator<GetApprovalTypeListQuery>
    {
        private readonly IApprovalTypeRepository _ApprovalTypeRepository;
        public GetApprovalTypeListQueryValidator(IApprovalTypeRepository ApprovalTypeRepository)
        {

            _ApprovalTypeRepository = ApprovalTypeRepository;

            //RuleFor(r => r.CategoryID)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
