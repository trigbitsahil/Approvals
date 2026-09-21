using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlDetail
{
    public class GetDocumentUrlDetailQueryHandler : IRequestHandler<GetDocumentUrlDetailQuery, GetDocumentUrlDetailQueryResponse>
    {
        private readonly IDocumentUrlRepository _documentUrlRepository;

        public GetDocumentUrlDetailQueryHandler(IDocumentUrlRepository documentUrlRepository)
        {
            _documentUrlRepository = documentUrlRepository;
        }

        public async Task<GetDocumentUrlDetailQueryResponse> Handle(GetDocumentUrlDetailQuery request, CancellationToken cancellationToken)
        {
            var response = new GetDocumentUrlDetailQueryResponse();

            if (string.IsNullOrWhiteSpace(request.DocumentUrlId))
            {
                response.Success = false;
                response.Message = "Document ID is required.";
                return response;
            }

            var doc = await _documentUrlRepository.GetByDocumentUrlIdAsync(request.DocumentUrlId);
            if (doc == null)
            {
                response.Success = false;
                response.Message = "Document not found.";
                return response;
            }

            response.Success = true;
            response.Message = "Document detail fetched successfully";
            response.Data = new DocumentUrlDetailVM
            {
                DocumentUrlID = doc.DocumentUrlID,
                Name = doc.Name,
                Description = doc.Description,
                Url = doc.Url,
                BlobUrl = doc.BlobUrl,
                Category = doc.Category,
                CategoryID = doc.CategoryID,
                Extension = doc.Extension,
                ContentType = doc.ContentType,
                DocumentFileName = doc.DocumentFileName,
                DocumentType = doc.DocumentType,
                DocumentTypeID = doc.DocumentTypeID,
                DocumentDate = doc.DocumentDate,
                FileSizeBytes = doc.FileSizeBytes,
                IsHyperlinkAndNotFile = doc.IsHyperlinkAndNotFile,
                IsVoided = doc.IsVoided,
                CreatedBy = doc.CreatedBy,
                CreatedDate = doc.CreatedDate,
                LastModifiedBy = doc.LastModifiedBy,
                LastModifiedDate = doc.LastModifiedDate,
                TenantId = doc.TenantId
            };

            return response;
        }
    }
}
