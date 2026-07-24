using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Domain.Entities.Global
{
    [Table("contract")]
    public class Contract
    {
        [Key]
        [ForeignKey("contract")]
        [Column("contract_id")]
        public string ContractId { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; }

        [Column("number")]
        public string? Number { get; set; }

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
