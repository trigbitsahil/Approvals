using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.DocumentUrls.Commands.CreateDocumentUrl
{
    public class CreateDocumentUrlCommandHandler : IRequestHandler<CreateDocumentUrlCommand, CreateDocumentUrlCommandResponse>
    {
        private readonly IDocumentUrlRepository _documentUrlRepository;
        private readonly ILoggedInUserService _loggedInUserService;

        public CreateDocumentUrlCommandHandler(
            IDocumentUrlRepository documentUrlRepository,
            ILoggedInUserService loggedInUserService)
        {
            _documentUrlRepository = documentUrlRepository;
            _loggedInUserService = loggedInUserService;
        }

        public async Task<CreateDocumentUrlCommandResponse> Handle(CreateDocumentUrlCommand request, CancellationToken cancellationToken)
        {
            var response = new CreateDocumentUrlCommandResponse();

            try
            {
                string category = request.Category ?? "General";
                string categoryId = request.CategoryID ?? "";
                string docId = string.Format(OOH.Domain.EntityColumn.KeyFormat, OOH.Domain.EntityPrefixes.DocUrl, DateTime.Now, Guid.NewGuid().ToString());

                string contentType = request.ContentType ?? "application/octet-stream";
                string rawContent = request.Content ?? "";

                string dataUrl;
                if (!string.IsNullOrWhiteSpace(request.Url) && request.Url.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
                {
                    dataUrl = request.Url;
                }
                else if (rawContent.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
                {
                    dataUrl = rawContent;
                }
                else
                {
                    dataUrl = $"data:{contentType};base64,{rawContent}";
                }

                long computedSizeBytes = 0;
                try
                {
                    string cleanBase64 = rawContent.Contains(",") ? rawContent.Split(',')[1] : rawContent;
                    byte[] bytes = Convert.FromBase64String(cleanBase64);
                    computedSizeBytes = bytes.Length;
                }
                catch
                {
                    computedSizeBytes = rawContent.Length;
                }

                string rawExt = request.Extension ?? ".bin";
                string extension = rawExt.StartsWith(".") ? rawExt : $".{rawExt}";

                var docEntity = new DocumentUrl
                {
                    DocumentUrlID = docId,
                    Name = request.Name ?? request.DocumentFileName ?? "Document",
                    Description = request.Description ?? "",
                    Url = dataUrl,
                    BlobUrl = !string.IsNullOrWhiteSpace(request.BlobUrl) ? request.BlobUrl : dataUrl,
                    Category = category,
                    CategoryID = categoryId,
                    Extension = extension,
                    ContentType = contentType,
                    DocumentFileName = request.DocumentFileName ?? $"{docId}{extension}",
                    DocumentType = request.DocumentType,
                    DocumentTypeID = request.DocumentTypeID,
                    DocumentDate = !string.IsNullOrWhiteSpace(request.DocumentDate) && DateTime.TryParse(request.DocumentDate, out var parsedDate) ? parsedDate : DateTime.UtcNow,
                    FileSizeBytes = request.FileSizeBytes ?? computedSizeBytes,
                    IsHyperlinkAndNotFile = request.IsHyperlinkAndNotFile,
                    IsVoided = false,
                    CreatedBy = _loggedInUserService?.UserEmail ?? "System",
                    CreatedDate = DateTime.UtcNow,
                    TenantId = _loggedInUserService?.TenantId ?? "1"
                };

                int rows = await _documentUrlRepository.AddAsync(docEntity);
                if (rows <= 0)
                {
                    response.Success = false;
                    response.Message = "Failed to insert record into document_url table (0 rows affected).";
                    return response;
                }

                response.Success = true;
                response.Message = "Document stored in database successfully";
                response.Data = docEntity;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Failed to save document to database: {ex.Message}";
            }

            return response;
        }
    }
}
