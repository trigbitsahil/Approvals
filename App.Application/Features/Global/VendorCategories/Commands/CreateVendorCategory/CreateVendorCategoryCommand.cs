using MediatR;

namespace OOH.Application.Features.Global.VendorCategories.Commands.CreateVendorCategory
{
    public class CreateVendorCategoryCommand : IRequest<CreateVendorCategoryCommandResponse>, OOH.Application.Contracts.Infrastructure.ITransactionalCommand
    {
        public string Name { get; set; }
    }
}
