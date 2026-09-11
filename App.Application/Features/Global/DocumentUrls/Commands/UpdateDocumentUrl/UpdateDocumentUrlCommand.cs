using MediatR;

namespace OOH.Application.Features.Global.DocumentUrls.Commands.UpdateDocumentUrl
{
    public class UpdateDocumentUrlCommand : IRequest<UpdateDocumentUrlCommandResponse>
    {
        public string? DocumentUrlID { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? DocumentType { get; set; }
    }
}
