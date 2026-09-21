using OOH.Application.Features.Global.ApprovalRetentionSettings.Queries.GetApprovalRetentionSetting;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.UpdateApprovalRetentionSetting
{
    public class UpdateApprovalRetentionSettingCommandResponse : BaseResponse
    {
        public UpdateApprovalRetentionSettingCommandResponse() : base()
        {
        }

        public UpdateApprovalRetentionSettingDto Data { get; set; } = default!;
    }
}
