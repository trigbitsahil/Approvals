using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlDetail
{
    public class GetDocumentUrlDetailQueryResponse
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public DocumentUrl? Data { get; set; }
    }
}
