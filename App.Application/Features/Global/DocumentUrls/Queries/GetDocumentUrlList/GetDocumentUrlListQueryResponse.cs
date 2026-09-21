using System.Collections.Generic;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlList
{
    public class GetDocumentUrlListQueryResponse : BaseResponse
    {
        public GetDocumentUrlListQueryResponse() : base()
        {
        }

        public List<DocumentUrlListVM> Data { get; set; } = new List<DocumentUrlListVM>();
    }
}
