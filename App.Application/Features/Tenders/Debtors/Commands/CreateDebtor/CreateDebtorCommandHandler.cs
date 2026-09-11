using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Debtors.Commands.CreateDebtor
{
    public class CreateDebtorCommandHandler : IRequestHandler<CreateDebtorCommand, CreateDebtorCommandResponse>
    {
        private readonly IDebtorRepository _debtorRepository;
        private readonly IMapper _mapper;

        public CreateDebtorCommandHandler(IMapper mapper, IDebtorRepository debtorRepository)
        {
            _mapper = mapper;
            _debtorRepository = debtorRepository;
        }

        public async Task<CreateDebtorCommandResponse> Handle(CreateDebtorCommand request, CancellationToken cancellationToken)
        {
            var createDebtorCommandResponse = new CreateDebtorCommandResponse();
            var validator = new CreateDebtorCommandValidator(_debtorRepository);
            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                createDebtorCommandResponse.Success = false;
                createDebtorCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createDebtorCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }
            }

            if (createDebtorCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.Debtor, DateTime.Now, Guid.NewGuid().ToString());
                Debtor entity = _mapper.Map<Debtor>(request);
                entity.DebtorId = entityKeyColumnValue;

                int i = await _debtorRepository.AddAsync(entity);

                if (i == -1)
                {
                    createDebtorCommandResponse.Success = false;
                }
                else
                {
                    createDebtorCommandResponse.Data = _mapper.Map<CreateDebtorDto>(entity);
                }
            }

            return createDebtorCommandResponse;
        }
    }
}
