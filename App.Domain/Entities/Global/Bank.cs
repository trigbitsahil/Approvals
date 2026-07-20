using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Domain.Entities.Global
{
    [Table("banks")]
    public class Bank
    {
        [Key]
        [Column("bank_id")]
        public string BankId { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; }

        [Column("type")]
        public string Type { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("address")]
        public string Address { get; set; }

        [Column("status")]
        public string Status { get; set; } = "Active";

        [Column("user_id")]
        public string? UserId { get; set; }

        [Required]
        [Column("is_active")]
        public bool IsActive { get; set; } = true;



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
