using MediatR;

namespace OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlDetail
{
    public class GetDocumentUrlDetailQuery : IRequest<GetDocumentUrlDetailQueryResponse>
    {
        public string DocumentUrlId { get; set; } = string.Empty;
    }
}
