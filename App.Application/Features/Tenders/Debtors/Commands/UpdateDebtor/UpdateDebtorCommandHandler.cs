using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Debtors.Commands.UpdateDebtor
{
    public class UpdateDebtorCommandHandler : IRequestHandler<UpdateDebtorCommand, UpdateDebtorCommandResponse>
    {
        private readonly IDebtorRepository _debtorRepository;
        private readonly IMapper _mapper;

        public UpdateDebtorCommandHandler(IMapper mapper, IDebtorRepository debtorRepository)
        {
            _mapper = mapper;
            _debtorRepository = debtorRepository;
        }

        public async Task<UpdateDebtorCommandResponse> Handle(UpdateDebtorCommand request, CancellationToken cancellationToken)
        {
            var recordToUpdate = await _debtorRepository.GetByIdAsync(request.DebtorId);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(Debtor), request.DebtorId);
            }

            var updateDebtorCommandResponse = new UpdateDebtorCommandResponse();
            var validator = new UpdateDebtorCommandValidator(_debtorRepository);
            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                updateDebtorCommandResponse.Success = false;
                updateDebtorCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateDebtorCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }
            }

            if (updateDebtorCommandResponse.Success)
            {
                _mapper.Map(request, recordToUpdate, typeof(UpdateDebtorCommand), typeof(Debtor));
                int i = await _debtorRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateDebtorCommandResponse.Success = false;
                }
                else
                {
                    updateDebtorCommandResponse.Data = _mapper.Map<UpdateDebtorDto>(recordToUpdate);
                }
            }

            return updateDebtorCommandResponse;
        }
    }
}
