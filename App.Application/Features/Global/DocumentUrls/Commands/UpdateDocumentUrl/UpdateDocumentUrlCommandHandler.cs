using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.DocumentUrls.Commands.UpdateDocumentUrl
{
    public class UpdateDocumentUrlCommandHandler : IRequestHandler<UpdateDocumentUrlCommand, UpdateDocumentUrlCommandResponse>
    {
        private readonly IDocumentUrlRepository _documentUrlRepository;

        public UpdateDocumentUrlCommandHandler(IDocumentUrlRepository documentUrlRepository)
        {
            _documentUrlRepository = documentUrlRepository;
        }

        public async Task<UpdateDocumentUrlCommandResponse> Handle(UpdateDocumentUrlCommand request, CancellationToken cancellationToken)
        {
            var response = new UpdateDocumentUrlCommandResponse();

            if (string.IsNullOrWhiteSpace(request.DocumentUrlID))
            {
                response.Success = false;
                response.Message = "Document ID is required for update.";
                return response;
            }

            var existing = await _documentUrlRepository.GetByDocumentUrlIdAsync(request.DocumentUrlID);
            if (existing == null)
            {
                response.Success = false;
                response.Message = "Document not found.";
                return response;
            }

            if (!string.IsNullOrWhiteSpace(request.Name)) existing.Name = request.Name;
            if (!string.IsNullOrWhiteSpace(request.Description)) existing.Description = request.Description;
            if (!string.IsNullOrWhiteSpace(request.DocumentType)) existing.DocumentType = request.DocumentType;

            await _documentUrlRepository.UpdateAsync(existing);

            response.Success = true;
            response.Message = "Document updated successfully";
            response.Data = existing;

            return response;
        }
    }
}
