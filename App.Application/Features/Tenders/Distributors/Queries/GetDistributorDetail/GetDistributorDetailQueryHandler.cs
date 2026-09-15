using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorDetail
{
    public class GetDistributorDetailQueryHandler : IRequestHandler<GetDistributorDetailQuery, GetDistributorDetailQueryResponse>
    {
        private readonly IDistributorRepository _distributorRepository;
        private readonly IMapper _mapper;

        public GetDistributorDetailQueryHandler(IMapper mapper, IDistributorRepository distributorRepository)
        {
            _mapper = mapper;
            _distributorRepository = distributorRepository;
        }

        public async Task<GetDistributorDetailQueryResponse> Handle(GetDistributorDetailQuery request, CancellationToken cancellationToken)
        {
            GetDistributorDetailQueryResponse response = new GetDistributorDetailQueryResponse();

            var validator = new GetDistributorDetailQueryValidator();
            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                response.Success = false;
                response.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    response.ValidationErrors.Add(error.ErrorMessage);
                }
            }

            if (response.Success)
            {
                Distributor entity = await _distributorRepository.GetByIdAsync(request.DistributorID);
                if (entity == null)
                {
                    response.Success = false;
                }
                else
                {
                    response.Data = _mapper.Map<DistributorDetailVM>(entity);
                }
            }

            return response;
        }
    }
}
