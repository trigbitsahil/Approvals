using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Debtors.Commands.DeleteDebtor
{
    public class DeleteDebtorCommandHandler : IRequestHandler<DeleteDebtorCommand, DeleteDebtorCommandResponse>
    {
        private readonly IDebtorRepository _debtorRepository;
        private readonly IMapper _mapper;

        public DeleteDebtorCommandHandler(IMapper mapper, IDebtorRepository debtorRepository)
        {
            _mapper = mapper;
            _debtorRepository = debtorRepository;
        }

        public async Task<DeleteDebtorCommandResponse> Handle(DeleteDebtorCommand request, CancellationToken cancellationToken)
        {
            DeleteDebtorCommandResponse deleteDebtorCommandResponse = new DeleteDebtorCommandResponse();
            var validator = new DeleteDebtorCommandValidator(_debtorRepository);
            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                deleteDebtorCommandResponse.Success = false;
                deleteDebtorCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteDebtorCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }
            }

            if (deleteDebtorCommandResponse.Success)
            {
                Debtor entity = await _debtorRepository.GetByIdAsync(request.DebtorId);
                int result;

                if (entity == null)
                {
                    deleteDebtorCommandResponse.Success = false;
                    deleteDebtorCommandResponse.Message = "Unable to delete the record, Record Does not exist";
                }
                else
                {
                    result = await _debtorRepository.VoidAsync(entity);

                    if (result == -1)
                    {
                        deleteDebtorCommandResponse.Success = false;
                        deleteDebtorCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteDebtorCommandResponse.Data = "Record Deleted";
                    }
                }
            }

            return deleteDebtorCommandResponse;
        }
    }
}
