using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlList
{
    public class GetDocumentUrlListQueryHandler : IRequestHandler<GetDocumentUrlListQuery, GetDocumentUrlListQueryResponse>
    {
        private readonly IDocumentUrlRepository _documentUrlRepository;

        public GetDocumentUrlListQueryHandler(IDocumentUrlRepository documentUrlRepository)
        {
            _documentUrlRepository = documentUrlRepository;
        }

        public async Task<GetDocumentUrlListQueryResponse> Handle(GetDocumentUrlListQuery request, CancellationToken cancellationToken)
        {
            List<DocumentUrl> docs;

            if (!string.IsNullOrWhiteSpace(request.DocType) || !string.IsNullOrWhiteSpace(request.DocTypeId))
            {
                docs = await _documentUrlRepository.GetByDocTypeAndDocTypeIdAsync(request.DocType ?? "", request.DocTypeId ?? "");
            }
            else if (!string.IsNullOrWhiteSpace(request.SearchText))
            {
                docs = await _documentUrlRepository.SearchDocumentsAsync(request.SearchText, request.Category ?? "", request.CategoryId ?? "");
            }
            else
            {
                docs = await _documentUrlRepository.GetByCategoryAndCategoryIdAsync(request.Category ?? "", request.CategoryId ?? "");
            }

            var vmList = docs.Select(d => new DocumentUrlListVM
            {
                DocumentUrlID = d.DocumentUrlID,
                Name = d.Name,
                Description = d.Description,
                Url = d.Url,
                BlobUrl = d.BlobUrl,
                Category = d.Category,
                CategoryID = d.CategoryID,
                Extension = d.Extension,
                ContentType = d.ContentType,
                DocumentFileName = d.DocumentFileName,
                DocumentType = d.DocumentType,
                DocumentTypeID = d.DocumentTypeID,
                DocumentDate = d.DocumentDate,
                FileSizeBytes = d.FileSizeBytes,
                IsHyperlinkAndNotFile = d.IsHyperlinkAndNotFile,
                IsVoided = d.IsVoided,
                CreatedBy = d.CreatedBy,
                CreatedDate = d.CreatedDate,
                LastModifiedBy = d.LastModifiedBy,
                LastModifiedDate = d.LastModifiedDate,
                TenantId = d.TenantId
            }).ToList();

            return new GetDocumentUrlListQueryResponse
            {
                Success = true,
                Message = "Documents fetched successfully",
                Data = vmList
            };
        }
    }
}
