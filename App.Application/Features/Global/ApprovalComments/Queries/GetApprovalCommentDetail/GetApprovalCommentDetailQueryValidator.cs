using FluentValidation;
using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentDetail
{
    public class GetApprovalCommentDetailQueryValidator : AbstractValidator<GetApprovalCommentDetailQuery>
    {
        private readonly IApprovalCommentRepository _ApprovalCommentRepository;
        public GetApprovalCommentDetailQueryValidator(IApprovalCommentRepository ApprovalCommentRepository)
        {

            _ApprovalCommentRepository = ApprovalCommentRepository;

            RuleFor(r => r.ApprovalCommentId)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
