using MediatR;

namespace OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlList
{
    public class GetDocumentUrlListQuery : IRequest<GetDocumentUrlListQueryResponse>
    {
        public string Category { get; set; } = string.Empty;
        public string CategoryId { get; set; } = string.Empty;
        public string? DocType { get; set; }
        public string? DocTypeId { get; set; }
        public string? SearchText { get; set; }
    }
}
