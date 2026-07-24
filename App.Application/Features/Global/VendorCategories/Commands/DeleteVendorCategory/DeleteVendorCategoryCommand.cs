using MediatR;

namespace OOH.Application.Features.Global.VendorCategories.Commands.DeleteVendorCategory
{
    public class DeleteVendorCategoryCommand : IRequest<DeleteVendorCategoryCommandResponse>, OOH.Application.Contracts.Infrastructure.ITransactionalCommand
    {
        public string VendorCategoryId { get; set; }
    }
}
