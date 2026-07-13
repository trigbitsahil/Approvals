using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.ApprovalStatuss.Commands.DeleteApprovalStatus
{
    public class DeleteApprovalStatusCommandValidator : AbstractValidator<DeleteApprovalStatusCommand>
    {
        private readonly IApprovalStatusRepository _ApprovalStatusRepository;
        public DeleteApprovalStatusCommandValidator(IApprovalStatusRepository ApprovalStatusRepository)
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
