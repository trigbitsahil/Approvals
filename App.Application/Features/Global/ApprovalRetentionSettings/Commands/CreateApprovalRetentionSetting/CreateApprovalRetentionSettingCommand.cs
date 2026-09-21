using MediatR;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.CreateApprovalRetentionSetting
{
    public class CreateApprovalRetentionSettingCommand : IRequest<CreateApprovalRetentionSettingCommandResponse>
    {
        public int RetentionDays { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
