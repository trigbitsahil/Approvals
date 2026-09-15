using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorList
{
    public class GetDistributorListQueryHandler : IRequestHandler<GetDistributorListQuery, GetDistributorListQueryResponse>
    {
        private readonly IDistributorRepository _distributorRepository;
        private readonly IMapper _mapper;

        public GetDistributorListQueryHandler(IMapper mapper, IDistributorRepository distributorRepository)
        {
            _mapper = mapper;
            _distributorRepository = distributorRepository;
        }

        public async Task<GetDistributorListQueryResponse> Handle(GetDistributorListQuery request, CancellationToken cancellationToken)
        {
            GetDistributorListQueryResponse response = new GetDistributorListQueryResponse();

            if (response.Success)
            {
                List<Distributor> entityList = await _distributorRepository.ListAllAsync();
                if (entityList == null)
                {
                    response.Success = false;
                }
                else
                {
                    response.Data = _mapper.Map<List<DistributorListVM>>(entityList);
                }
            }

            return response;
        }
    }
}
