using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.DeleteApprovalApprover
{
    public class DeleteApprovalApproverCommandValidator : AbstractValidator<DeleteApprovalApproverCommand>
    {
        private readonly IApprovalApproverRepository _ApprovalApproverRepository;
        public DeleteApprovalApproverCommandValidator(IApprovalApproverRepository ApprovalApproverRepository)
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
