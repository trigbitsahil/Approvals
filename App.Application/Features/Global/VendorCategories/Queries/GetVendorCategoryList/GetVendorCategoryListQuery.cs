using MediatR;
using OOH.Application.Contracts.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.VendorCategories.Queries.GetVendorCategoryList
{
    public class VendorCategoryListVM
    {
        public string VendorCategoryId { get; set; }
        public string Name { get; set; }
        public bool IsVoided { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }

    public class GetVendorCategoryListQuery : IRequest<List<VendorCategoryListVM>>
    {
    }

    public class GetVendorCategoryListQueryHandler : IRequestHandler<GetVendorCategoryListQuery, List<VendorCategoryListVM>>
    {
        private readonly IVendorCategoryRepository _vendorCategoryRepository;

        public GetVendorCategoryListQueryHandler(IVendorCategoryRepository vendorCategoryRepository)
        {
            _vendorCategoryRepository = vendorCategoryRepository;
        }

        public async Task<List<VendorCategoryListVM>> Handle(GetVendorCategoryListQuery request, CancellationToken cancellationToken)
        {
            var vendorCategories = await _vendorCategoryRepository.ListAllAsync();
            return vendorCategories.Where(c => !c.IsVoided).Select(c => new VendorCategoryListVM
            {
                VendorCategoryId = c.VendorCategoryId,
                Name = c.Name,
                IsVoided = c.IsVoided,
                CreatedBy = c.CreatedBy,
                CreatedDate = c.CreatedDate,
                LastModifiedBy = c.LastModifiedBy,
                LastModifiedDate = c.LastModifiedDate
            }).ToList();
        }
    }
}
