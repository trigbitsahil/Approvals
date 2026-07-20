using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Domain.Entities.Transactions
{
    [Table("transaction_type")]
    public class TransactionType
    {
        [Key]
        [Column("transaction_type_id")]
        public string TransactionTypeId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }

        // Audit Columns
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
