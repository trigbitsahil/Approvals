using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Debtors.Queries.GetDebtorList
{
    public class GetDebtorListQueryHandler : IRequestHandler<GetDebtorListQuery, GetDebtorListQueryResponse>
    {
        private readonly IDebtorRepository _debtorRepository;
        private readonly IMapper _mapper;

        public GetDebtorListQueryHandler(IMapper mapper, IDebtorRepository debtorRepository)
        {
            _mapper = mapper;
            _debtorRepository = debtorRepository;
        }

        public async Task<GetDebtorListQueryResponse> Handle(GetDebtorListQuery request, CancellationToken cancellationToken)
        {
            GetDebtorListQueryResponse response = new GetDebtorListQueryResponse();

            if (response.Success)
            {
                List<Debtor> entityList = await _debtorRepository.ListAllAsync();
                if (entityList == null)
                {
                    response.Success = false;
                }
                else
                {
                    response.Data = _mapper.Map<List<DebtorListVM>>(entityList);
                }
            }

            return response;
        }
    }
}
