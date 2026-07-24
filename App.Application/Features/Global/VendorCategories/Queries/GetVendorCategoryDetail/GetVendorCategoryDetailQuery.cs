using MediatR;
using OOH.Application.Contracts.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.VendorCategories.Queries.GetVendorCategoryDetail
{
    public class VendorCategoryDetailVM
    {
        public string VendorCategoryId { get; set; }
        public string Name { get; set; }
        public bool IsVoided { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }

    public class GetVendorCategoryDetailQuery : IRequest<VendorCategoryDetailVM>
    {
        public string VendorCategoryId { get; set; }
    }

    public class GetVendorCategoryDetailQueryHandler : IRequestHandler<GetVendorCategoryDetailQuery, VendorCategoryDetailVM>
    {
        private readonly IVendorCategoryRepository _vendorCategoryRepository;

        public GetVendorCategoryDetailQueryHandler(IVendorCategoryRepository vendorCategoryRepository)
        {
            _vendorCategoryRepository = vendorCategoryRepository;
        }

        public async Task<VendorCategoryDetailVM> Handle(GetVendorCategoryDetailQuery request, CancellationToken cancellationToken)
        {
            var vendorCategory = await _vendorCategoryRepository.GetByIdAsync(request.VendorCategoryId);

            if (vendorCategory == null)
            {
                return null;
            }

            return new VendorCategoryDetailVM
            {
                VendorCategoryId = vendorCategory.VendorCategoryId,
                Name = vendorCategory.Name,
                IsVoided = vendorCategory.IsVoided,
                CreatedBy = vendorCategory.CreatedBy,
                CreatedDate = vendorCategory.CreatedDate,
                LastModifiedBy = vendorCategory.LastModifiedBy,
                LastModifiedDate = vendorCategory.LastModifiedDate
            };
        }
    }
}
