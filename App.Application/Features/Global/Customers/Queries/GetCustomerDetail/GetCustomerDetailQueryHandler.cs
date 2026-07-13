using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Customers.Queries.GetCustomerDetail
{
    public class GetCustomerDetailQueryHandler :
     IRequestHandler<GetCustomerDetailQuery, GetCustomerDetailQueryResponse>
    {

        private readonly ICustomerRepository _CustomerRepository;

        private readonly IMapper _mapper;
        public GetCustomerDetailQueryHandler(IMapper mapper, ICustomerRepository CustomerRepository)
        {
            _mapper = mapper;
            _CustomerRepository = CustomerRepository;
        }



        public async Task<GetCustomerDetailQueryResponse> Handle(GetCustomerDetailQuery request, CancellationToken cancellationToken)
        {

            GetCustomerDetailQueryResponse getCustomerDetailQueryResponse = new GetCustomerDetailQueryResponse();

            var validator = new GetCustomerDetailQueryValidator(_CustomerRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getCustomerDetailQueryResponse.Success = false;
                getCustomerDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getCustomerDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getCustomerDetailQueryResponse.Success)
            {

                Customer entity = await _CustomerRepository.GetByIdAsync(request.CustomerId);



                if (entity == null)
                {
                    getCustomerDetailQueryResponse.Success = false;

                }
                else
                {
                    getCustomerDetailQueryResponse.Data = _mapper.Map<CustomerDetailVM>(entity);

                }

            }


            return getCustomerDetailQueryResponse;



        }


    }
}
