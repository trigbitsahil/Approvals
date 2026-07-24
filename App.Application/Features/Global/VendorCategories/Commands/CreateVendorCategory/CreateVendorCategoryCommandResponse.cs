using MediatR;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.VendorCategories.Commands.CreateVendorCategory
{
    public class CreateVendorCategoryCommandResponse : BaseResponse
    {
        public CreateVendorCategoryCommandResponse() : base()
        {
        }

        public CreateVendorCategoryDto Data { get; set; }
    }
}
