using System;

namespace OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlDetail
{
    public class DocumentUrlDetailVM
    {
        public string DocumentUrlID { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string BlobUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string CategoryID { get; set; } = string.Empty;
        public string Extension { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public string DocumentFileName { get; set; } = string.Empty;
        public string DocumentType { get; set; } = string.Empty;
        public string DocumentTypeID { get; set; } = string.Empty;
        public DateTime? DocumentDate { get; set; }
        public long? FileSizeBytes { get; set; }
        public bool IsHyperlinkAndNotFile { get; set; }
        public bool IsVoided { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public string LastModifiedBy { get; set; } = string.Empty;
        public DateTime? LastModifiedDate { get; set; }
        public string TenantId { get; set; } = string.Empty;
    }
}
