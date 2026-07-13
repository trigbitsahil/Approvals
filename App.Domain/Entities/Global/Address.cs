using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Global
{

    [Table("address")]
    public class Address
     {
        [Key]
        [ForeignKey("address")]
        [Column("address_id")]
        public string AddressId { get; set; }
        [Required]
        [Column("name")]
        public string Name { get; set; }
        [Required]
        [Column("contact_person_name")]
        public string ContactPersonName { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Column("email")]
        public string Email { get; set; }
        [Column("phone")]
        public string Phone { get; set; }
        [Column("website")]
        public string Website { get; set; }
        [Required]
        [Column("address_line_1")]
        public string AddressLine1 { get; set; }
        [Column("address_line_2")]
        public string AddressLine2 { get; set; }
        [Required]
        [Column("city")]
        public string City { get; set; }
        [Required]
        [Column("state_id")]
        public string StateId { get; set; }
        [Required]
        [Column("country_id")]
        public string CountryId { get; set; }
        [Required]
        [Column("zip_code")]
        public string ZipCode { get; set; }
        [Required]
        [Column("is_active")]
        public bool IsActive { get; set; }
        [Required]
        [Column("category")]
        public string Category { get; set; }
        [Required]
        [Column("category_id")]
        public string CategoryId { get; set; }
        [Column("address_type")]
        public string AddressType { get; set; }
        [Column("address_type_id")]
        public string AddressTypeId { get; set; }
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
