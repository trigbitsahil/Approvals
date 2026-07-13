using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Global
{

    [Table("approval_media")]
    public class ApprovalMedia
     {
        [Key]
        [ForeignKey("approval_media")]
        [Column("approval_media_id")]
        public string ApprovalMediaId { get; set; }
        [Required]
        [Column("approval_id")]
        public string ApprovalId { get; set; }
        [Required]
        [Column("media_id")]
        public string MediaId { get; set; }
        [Required]
        [Column("is_voided")]
        public bool IsVoided { get; set; }
        [Column("created_by")]
        public string CreatedBy { get; set; }
        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
        [Column("last_modified_by")]
        public string LastModifiedBy { get; set; }
        [Column("last_modified_date")]
        public DateTime? LastModifiedDate { get; set; }
        [Required]
        [Column("tenant_id")]
        public string TenantId { get; set; }
     }
}
