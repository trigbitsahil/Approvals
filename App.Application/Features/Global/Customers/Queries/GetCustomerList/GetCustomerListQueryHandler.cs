using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Customers.Queries.GetCustomerList
{
    public class GetCustomerListQueryHandler :
        IRequestHandler<GetCustomerListQuery, GetCustomerListQueryResponse>
    {
        private readonly ICustomerRepository _CustomerRepository;

        private readonly IMapper _mapper;
        public GetCustomerListQueryHandler(IMapper mapper, ICustomerRepository CustomerRepository)
        {
            _mapper = mapper;
            _CustomerRepository = CustomerRepository;
        }




        public async Task<GetCustomerListQueryResponse> Handle(GetCustomerListQuery request, CancellationToken cancellationToken)
        {



            GetCustomerListQueryResponse getCustomerListQueryResponse = new GetCustomerListQueryResponse();



            if (getCustomerListQueryResponse.Success)
            {

                List<Customer> entitylist = await _CustomerRepository.ListAllAsync();
                //List<CustomerListVM> entitylist = await _CustomerRepository.ListAllCustomersAsync(request.Category, request.CategoryID);



                if (entitylist == null)
                {
                    getCustomerListQueryResponse.Success = false;

                }
                else
                {
                    getCustomerListQueryResponse.Data = _mapper.Map<List<CustomerListVM>>(entitylist);

                   // getCustomerListQueryResponse.Data = entitylist;

                }

            }

            return getCustomerListQueryResponse;


        }


    }
}
