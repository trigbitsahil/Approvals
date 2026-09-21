using System;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Queries.GetApprovalRetentionSetting
{
    public class ApprovalRetentionSettingVM
    {
        public string SettingId { get; set; } = string.Empty;
        public int RetentionDays { get; set; }
        public bool IsActive { get; set; } = true;
        public string TenantId { get; set; } = string.Empty;
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? LastModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
