using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Debtors.Queries.GetDebtorDetail
{
    public class GetDebtorDetailQueryHandler : IRequestHandler<GetDebtorDetailQuery, GetDebtorDetailQueryResponse>
    {
        private readonly IDebtorRepository _debtorRepository;
        private readonly IMapper _mapper;

        public GetDebtorDetailQueryHandler(IMapper mapper, IDebtorRepository debtorRepository)
        {
            _mapper = mapper;
            _debtorRepository = debtorRepository;
        }

        public async Task<GetDebtorDetailQueryResponse> Handle(GetDebtorDetailQuery request, CancellationToken cancellationToken)
        {
            GetDebtorDetailQueryResponse response = new GetDebtorDetailQueryResponse();

            var validator = new GetDebtorDetailQueryValidator();
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
                Debtor entity = await _debtorRepository.GetByIdAsync(request.DebtorID);
                if (entity == null)
                {
                    response.Success = false;
                }
                else
                {
                    response.Data = _mapper.Map<DebtorDetailVM>(entity);
                }
            }

            return response;
        }
    }
}
