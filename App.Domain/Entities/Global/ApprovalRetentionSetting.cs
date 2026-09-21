using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Domain.Entities.Global
{
    [Table("approval_retention_setting")]
    public class ApprovalRetentionSetting
    {
        [Key]
        [Column("setting_id")]
        public string SettingId { get; set; } = string.Empty;

        [Column("retention_days")]
        public int RetentionDays { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Required]
        [Column("tenant_id")]
        public string TenantId { get; set; } = string.Empty;

        [Required]
        [Column("is_voided")]
        public bool IsVoided { get; set; } = false;

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }

        [Column("last_modified_by")]
        public string? LastModifiedBy { get; set; }

        [Column("last_modified_date")]
        public DateTime? LastModifiedDate { get; set; }
    }
}
