using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Tenders
{

    [Table("govt_body")]
    public class GovtBody
     {
        [Key]
        [ForeignKey("govt_body")]
        [Column("govt_body_id")]
        public string GovtBodyId { get; set; }
        [Required]
        [Column("name")]
        public string Name { get; set; }
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
        [Column("state")]
        public string State { get; set; }
        [Required]
        [Column("country")]
        public string Country { get; set; }
        [Required]
        [Column("zip_code")]
        public string ZipCode { get; set; }
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
        [Column("is_voided")]
        public bool IsVoided { get; set; }
        [Required]
        [Column("tenant_id")]
        public string TenantId { get; set; }
     }
}
