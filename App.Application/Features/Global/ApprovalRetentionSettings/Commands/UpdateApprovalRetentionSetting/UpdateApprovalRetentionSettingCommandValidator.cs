using FluentValidation;
using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.UpdateApprovalRetentionSetting
{
    public class UpdateApprovalRetentionSettingCommandValidator : AbstractValidator<UpdateApprovalRetentionSettingCommand>
    {
        private readonly IApprovalRetentionSettingRepository _repository;

        public UpdateApprovalRetentionSettingCommandValidator(IApprovalRetentionSettingRepository repository)
        {
            _repository = repository;

            RuleFor(r => r.SettingId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull()
                .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");

            RuleFor(p => p.RetentionDays)
                .GreaterThan(0)
                .WithMessage("{PropertyName} must be greater than 0.");
        }
    }
}
