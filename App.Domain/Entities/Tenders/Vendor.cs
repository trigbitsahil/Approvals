using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Tenders
{

    [Table("vendor")]
    public class Vendor
    {
        [Key]
        [ForeignKey("vendor")]
        [Column("vendor_id")]
        public string VendorId { get; set; }
        [Required]
        [Column("name")]
        public string Name { get; set; }
        [Column("email")]
        public string Email { get; set; }
        [Column("phone")]
        public string Phone { get; set; }
        [Column("website")]
        public string Website { get; set; }
        [Column("gst_number")]
        public string GstNumber { get; set; }
        [Column("pan_number")]
        public string PanNumber { get; set; }
        [Column("address")]
        public string Address { get; set; }
        [Column("note")]
        public string Note { get; set; }
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
