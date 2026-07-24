using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.VendorCategories.Commands.DeleteVendorCategory
{
    public class DeleteVendorCategoryCommandHandler : IRequestHandler<DeleteVendorCategoryCommand, DeleteVendorCategoryCommandResponse>
    {
        private readonly IVendorCategoryRepository _vendorCategoryRepository;

        public DeleteVendorCategoryCommandHandler(IVendorCategoryRepository vendorCategoryRepository)
        {
            _vendorCategoryRepository = vendorCategoryRepository;
        }

        public async Task<DeleteVendorCategoryCommandResponse> Handle(DeleteVendorCategoryCommand request, CancellationToken cancellationToken)
        {
            var deleteVendorCategoryCommandResponse = new DeleteVendorCategoryCommandResponse();
            var vendorCategoryToDelete = await _vendorCategoryRepository.GetByIdAsync(request.VendorCategoryId);

            if (vendorCategoryToDelete == null)
            {
                throw new NotFoundException(nameof(VendorCategory), request.VendorCategoryId);
            }

            await _vendorCategoryRepository.VoidAsync(vendorCategoryToDelete);
            return deleteVendorCategoryCommandResponse;
        }
    }
}
