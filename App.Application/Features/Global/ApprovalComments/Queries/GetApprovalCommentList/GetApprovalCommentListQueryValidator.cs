using FluentValidation;
using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentList
{
    public class GetApprovalCommentListQueryValidator : AbstractValidator<GetApprovalCommentListQuery>
    {
        private readonly IApprovalCommentRepository _ApprovalCommentRepository;
        public GetApprovalCommentListQueryValidator(IApprovalCommentRepository ApprovalCommentRepository)
        {

            _ApprovalCommentRepository = ApprovalCommentRepository;

            RuleFor(r => r.ApprovalId)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
