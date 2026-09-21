using System;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.CreateApprovalRetentionSetting
{
    public class CreateApprovalRetentionSettingDto
    {
        public string SettingId { get; set; } = string.Empty;
        public int RetentionDays { get; set; }
        public bool IsActive { get; set; }
        public string TenantId { get; set; } = string.Empty;
        public bool IsVoided { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? LastModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
