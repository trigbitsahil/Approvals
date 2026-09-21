using FluentValidation;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.DeleteApprovalRetentionSetting
{
    public class DeleteApprovalRetentionSettingCommandValidator : AbstractValidator<DeleteApprovalRetentionSettingCommand>
    {
        public DeleteApprovalRetentionSettingCommandValidator()
        {
            RuleFor(p => p.SettingId)
                .NotEmpty()
                .WithMessage("SettingId is required.");
        }
    }
}
