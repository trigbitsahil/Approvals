using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Queries.GetApprovalRetentionSetting
{
    public class GetApprovalRetentionSettingQueryResponse : BaseResponse
    {
        public GetApprovalRetentionSettingQueryResponse() : base()
        {
        }

        public ApprovalRetentionSettingVM? Data { get; set; }
    }
}
