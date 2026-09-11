using MediatR;

namespace OOH.Application.Features.Global.DocumentUrls.Commands.CreateDocumentUrl
{
    public class CreateDocumentUrlCommand : IRequest<CreateDocumentUrlCommandResponse>
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Url { get; set; }
        public string? Category { get; set; }
        public string? CategoryID { get; set; }
        public string? Extension { get; set; }
        public string? Content { get; set; }
        public string? ContentType { get; set; }
        public string? DocumentFileName { get; set; }
        public string? DocumentType { get; set; }
        public string? DocumentTypeID { get; set; }
        public long? FileSizeBytes { get; set; }
        public bool IsHyperlinkAndNotFile { get; set; }
        public string? BlobUrl { get; set; }
        public string? DocumentDate { get; set; }
    }
}
