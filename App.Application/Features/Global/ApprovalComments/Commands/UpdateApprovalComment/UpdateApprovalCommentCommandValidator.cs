using FluentValidation;
using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.UpdateApprovalComment
{
    public class UpdateApprovalCommentCommandValidator : AbstractValidator<UpdateApprovalCommentCommand>
    {
        private readonly IApprovalCommentRepository _ApprovalCommentRepository;
        public UpdateApprovalCommentCommandValidator(IApprovalCommentRepository ApprovalCommentRepository)
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
