using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Global
{

    [Table("customer")]
    public class Customer
     {
        [Key]
        [ForeignKey("customer")]
        [Column("customer_id")]
        public string CustomerId { get; set; }
        [Column("company_name")]
        public string CompanyName { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Required]
        [Column("status")]
        public string Status { get; set; }
        [Required]
        [Column("first_name")]
        public string FirstName { get; set; }
        [Required]
        [Column("last_name")]
        public string LastName { get; set; }
        [Required]
        [Column("email")]
        public string Email { get; set; }
        [Required]
        [Column("phone")]
        public string Phone { get; set; }
        [Required]
        [Column("payment_terms")]
        public string PaymentTerms { get; set; }
        [Required]
        [Column("tax_id")]
        public string TaxId { get; set; }
        [Column("address_id")]
        public string AddressId { get; set; }
        [Required]
        [Column("is_active")]
        public bool IsActive { get; set; }
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
