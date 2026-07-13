using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Vendors.Queries.GetVendorList
{
    public class GetVendorListQueryHandler :
        IRequestHandler<GetVendorListQuery, GetVendorListQueryResponse>
    {
        private readonly IVendorRepository _VendorRepository;

        private readonly IMapper _mapper;
        public GetVendorListQueryHandler(IMapper mapper, IVendorRepository VendorRepository)
        {
            _mapper = mapper;
            _VendorRepository = VendorRepository;
        }




        public async Task<GetVendorListQueryResponse> Handle(GetVendorListQuery request, CancellationToken cancellationToken)
        {



            GetVendorListQueryResponse getVendorListQueryResponse = new GetVendorListQueryResponse();



            if (getVendorListQueryResponse.Success)
            {

                List<Vendor> entitylist = await _VendorRepository.ListAllAsync();
           //     List<VendorListVM> entitylist = await _VendorRepository.ListAllVendorsAsync(request.Category, request.CategoryID);



                if (entitylist == null)
                {
                    getVendorListQueryResponse.Success = false;

                }
                else
                {
                    getVendorListQueryResponse.Data = _mapper.Map<List<VendorListVM>>(entitylist);

                    //getVendorListQueryResponse.Data = entitylist;

                }

            }

            return getVendorListQueryResponse;


        }


    }
}
