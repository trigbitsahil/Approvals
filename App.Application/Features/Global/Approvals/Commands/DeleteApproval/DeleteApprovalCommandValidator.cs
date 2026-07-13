using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.Approvals.Commands.DeleteApproval
{
    public class DeleteApprovalCommandValidator : AbstractValidator<DeleteApprovalCommand>
    {
        private readonly IApprovalRepository _ApprovalRepository;
        public DeleteApprovalCommandValidator(IApprovalRepository ApprovalRepository)
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
