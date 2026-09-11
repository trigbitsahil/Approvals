using MediatR;

namespace OOH.Application.Features.Global.DocumentUrls.Commands.DeleteDocumentUrl
{
    public class DeleteDocumentUrlCommand : IRequest<DeleteDocumentUrlCommandResponse>
    {
        public string DocumentUrlId { get; set; } = string.Empty;
    }
}
