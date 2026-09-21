using OOH.Application.Features.Global.ApprovalRetentionSettings.Queries.GetApprovalRetentionSetting;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.CreateApprovalRetentionSetting
{
    public class CreateApprovalRetentionSettingCommandResponse : BaseResponse
    {
        public CreateApprovalRetentionSettingCommandResponse() : base()
        {
        }

        public CreateApprovalRetentionSettingDto Data { get; set; } = default!;
    }
}
