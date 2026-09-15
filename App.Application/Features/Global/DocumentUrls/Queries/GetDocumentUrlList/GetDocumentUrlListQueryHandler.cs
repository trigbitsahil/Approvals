using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;
using System.Collections.Generic;
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

            return new GetDocumentUrlListQueryResponse
            {
                Success = true,
                Message = "Documents fetched successfully",
                Data = docs
            };
        }
    }
}
