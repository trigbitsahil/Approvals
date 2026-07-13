using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Tenders
{

    [Table("expense_type")]
    public class ExpenseType
    {
        [Key]
        [ForeignKey("expense_type")]
        [Column("expense_type_id")]
        public string ExpenseTypeId { get; set; }
        [Required]
        [Column("name")]
        public string Name { get; set; }
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

        [Required]
        [Column("expense_category_id")]
        public string ExpenseCategoryId { get; set; }
    }
}
