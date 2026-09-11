using OOH.Domain.Entities.Global;
using System.Collections.Generic;

namespace OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlList
{
    public class GetDocumentUrlListQueryResponse
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public List<DocumentUrl> Data { get; set; } = new List<DocumentUrl>();
    }
}
