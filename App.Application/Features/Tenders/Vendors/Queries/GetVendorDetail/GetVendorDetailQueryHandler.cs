using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Vendors.Queries.GetVendorDetail
{
    public class GetVendorDetailQueryHandler :
     IRequestHandler<GetVendorDetailQuery, GetVendorDetailQueryResponse>
    {

        private readonly IVendorRepository _VendorRepository;

        private readonly IMapper _mapper;
        public GetVendorDetailQueryHandler(IMapper mapper, IVendorRepository VendorRepository)
        {
            _mapper = mapper;
            _VendorRepository = VendorRepository;
        }



        public async Task<GetVendorDetailQueryResponse> Handle(GetVendorDetailQuery request, CancellationToken cancellationToken)
        {

            GetVendorDetailQueryResponse getVendorDetailQueryResponse = new GetVendorDetailQueryResponse();

            var validator = new GetVendorDetailQueryValidator(_VendorRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getVendorDetailQueryResponse.Success = false;
                getVendorDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getVendorDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getVendorDetailQueryResponse.Success)
            {

                Vendor entity = await _VendorRepository.GetByIdAsync(request.VendorID);



                if (entity == null)
                {
                    getVendorDetailQueryResponse.Success = false;

                }
                else
                {
                    getVendorDetailQueryResponse.Data = _mapper.Map<VendorDetailVM>(entity);

                }

            }


            return getVendorDetailQueryResponse;



        }


    }
}
