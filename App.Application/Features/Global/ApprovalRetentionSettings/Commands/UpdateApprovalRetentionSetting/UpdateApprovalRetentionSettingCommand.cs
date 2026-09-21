using MediatR;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.UpdateApprovalRetentionSetting
{
    public class UpdateApprovalRetentionSettingCommand : IRequest<UpdateApprovalRetentionSettingCommandResponse>
    {
        public string SettingId { get; set; }
        public int RetentionDays { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
