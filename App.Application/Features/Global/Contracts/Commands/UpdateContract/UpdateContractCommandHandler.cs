using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Contracts.Commands.UpdateContract
{
    public class UpdateContractCommandHandler : IRequestHandler<UpdateContractCommand, UpdateContractCommandResponse>
    {
        private readonly IContractRepository _contractRepository;

        public UpdateContractCommandHandler(IContractRepository contractRepository)
        {
            _contractRepository = contractRepository;
        }

        public async Task<UpdateContractCommandResponse> Handle(UpdateContractCommand request, CancellationToken cancellationToken)
        {
            var response = new UpdateContractCommandResponse();

            var contractToUpdate = await _contractRepository.GetByIdForUpdateAsync(request.ContractId);
            if (contractToUpdate == null)
            {
                throw new NotFoundException(nameof(Contract), request.ContractId);
            }

            contractToUpdate.Name = request.Name;
            contractToUpdate.Number = request.Number;
            contractToUpdate.LastModifiedDate = DateTime.UtcNow;

            await _contractRepository.UpdateAsync(contractToUpdate);

            response.Data = new UpdateContractDto
            {
                ContractId = contractToUpdate.ContractId,
                Name = contractToUpdate.Name,
                Number = contractToUpdate.Number,
                IsVoided = contractToUpdate.IsVoided,
                LastModifiedBy = contractToUpdate.LastModifiedBy,
                LastModifiedDate = contractToUpdate.LastModifiedDate
            };

            return response;
        }
    }
}
