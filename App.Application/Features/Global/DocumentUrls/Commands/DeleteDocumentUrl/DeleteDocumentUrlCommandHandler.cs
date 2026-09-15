using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.DocumentUrls.Commands.DeleteDocumentUrl
{
    public class DeleteDocumentUrlCommandHandler : IRequestHandler<DeleteDocumentUrlCommand, DeleteDocumentUrlCommandResponse>
    {
        private readonly IDocumentUrlRepository _documentUrlRepository;

        public DeleteDocumentUrlCommandHandler(IDocumentUrlRepository documentUrlRepository)
        {
            _documentUrlRepository = documentUrlRepository;
        }

        public async Task<DeleteDocumentUrlCommandResponse> Handle(DeleteDocumentUrlCommand request, CancellationToken cancellationToken)
        {
            var response = new DeleteDocumentUrlCommandResponse();

            if (string.IsNullOrWhiteSpace(request.DocumentUrlId))
            {
                response.Success = false;
                response.Message = "Document ID is required.";
                return response;
            }

            var existing = await _documentUrlRepository.GetByDocumentUrlIdAsync(request.DocumentUrlId);
            if (existing == null)
            {
                response.Success = false;
                response.Message = "Document not found.";
                return response;
            }

            await _documentUrlRepository.VoidAsync(existing);

            response.Success = true;
            response.Message = "Document deleted successfully";
            response.Data = existing;

            return response;
        }
    }
}
