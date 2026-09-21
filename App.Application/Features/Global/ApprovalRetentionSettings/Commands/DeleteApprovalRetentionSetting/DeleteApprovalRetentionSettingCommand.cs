using MediatR;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.DeleteApprovalRetentionSetting
{
    public class DeleteApprovalRetentionSettingCommand : IRequest<DeleteApprovalRetentionSettingCommandResponse>
    {
        public string SettingId { get; set; } = string.Empty;
    }
}
