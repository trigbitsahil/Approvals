using OOH.Application.Responses;

namespace OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlDetail
{
    public class GetDocumentUrlDetailQueryResponse : BaseResponse
    {
        public GetDocumentUrlDetailQueryResponse() : base()
        {
        }

        public DocumentUrlDetailVM? Data { get; set; }
    }
}
