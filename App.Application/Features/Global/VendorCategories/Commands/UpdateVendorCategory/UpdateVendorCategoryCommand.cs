using MediatR;

namespace OOH.Application.Features.Global.VendorCategories.Commands.UpdateVendorCategory
{
    public class UpdateVendorCategoryCommand : IRequest<UpdateVendorCategoryCommandResponse>, OOH.Application.Contracts.Infrastructure.ITransactionalCommand
    {
        public string VendorCategoryId { get; set; }
        public string Name { get; set; }
    }
}
