using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Domain.Entities.Global
{
    [Table("document_url")]
    public class DocumentUrl
    {
        [Key]
        [Column("document_url_id")]
        public string DocumentUrlID { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("url")]
        public string Url { get; set; }

        [Column("blob_url")]
        public string BlobUrl { get; set; }

        [Required]
        [Column("category")]
        public string Category { get; set; }

        [Required]
        [Column("category_id")]
        public string CategoryID { get; set; }

        [Required]
        [Column("extension")]
        public string Extension { get; set; }

        [Required]
        [Column("content_type")]
        public string ContentType { get; set; }

        [Required]
        [Column("document_file_name")]
        public string DocumentFileName { get; set; }

        [Column("document_type")]
        public string DocumentType { get; set; }

        [Column("document_type_id")]
        public string DocumentTypeID { get; set; }

        [Column("document_date")]
        public DateTime? DocumentDate { get; set; }

        [Column("file_size_bytes")]
        public long? FileSizeBytes { get; set; }

        [Column("is_hyperlink_and_not_file")]
        public bool IsHyperlinkAndNotFile { get; set; } = false;

        [Required]
        [Column("is_voided")]
        public bool IsVoided { get; set; } = false;

        [Column("created_by")]
        public string CreatedBy { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [Column("last_modified_by")]
        public string LastModifiedBy { get; set; }

        [Column("last_modified_date")]
        public DateTime? LastModifiedDate { get; set; }

        [Required]
        [Column("tenant_id")]
        public string TenantId { get; set; } = "1";
    }
}
