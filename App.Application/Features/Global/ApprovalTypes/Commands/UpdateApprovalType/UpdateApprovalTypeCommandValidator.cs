using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.ApprovalTypes.Commands.UpdateApprovalType
{
    public class UpdateApprovalTypeCommandValidator : AbstractValidator<UpdateApprovalTypeCommand>
    {
        private readonly IApprovalTypeRepository _ApprovalTypeRepository;
        public UpdateApprovalTypeCommandValidator(IApprovalTypeRepository ApprovalTypeRepository)
        {

            _ApprovalTypeRepository = ApprovalTypeRepository;

            RuleFor(r => r.ApprovalTypeID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }

    }
}
