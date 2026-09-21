using FluentValidation;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.CreateApprovalRetentionSetting
{
    public class CreateApprovalRetentionSettingCommandValidator : AbstractValidator<CreateApprovalRetentionSettingCommand>
    {
        public CreateApprovalRetentionSettingCommandValidator()
        {
            RuleFor(p => p.RetentionDays)
                .GreaterThan(0)
                .WithMessage("RetentionDays must be greater than 0.");
        }
    }
}
