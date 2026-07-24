using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using OOH.Domain;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Contracts.Commands.CreateContract
{
    public class CreateContractCommandHandler : IRequestHandler<CreateContractCommand, CreateContractCommandResponse>
    {
        private readonly IContractRepository _contractRepository;

        public CreateContractCommandHandler(IContractRepository contractRepository)
        {
            _contractRepository = contractRepository;
        }

        public async Task<CreateContractCommandResponse> Handle(CreateContractCommand request, CancellationToken cancellationToken)
        {
            var response = new CreateContractCommandResponse();

            string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.Contract, DateTime.Now, System.Guid.NewGuid().ToString());

            var contract = new Contract
            {
                ContractId = entityKeyColumnValue,
                Name = request.Name,
                Number = request.Number,
                IsVoided = false
            };

            await _contractRepository.AddAsync(contract);

            response.Data = new CreateContractDto
            {
                ContractId = contract.ContractId,
                Name = contract.Name,
                Number = contract.Number,
                IsVoided = contract.IsVoided,
                CreatedBy = contract.CreatedBy,
                CreatedDate = contract.CreatedDate
            };

            return response;
        }
    }
}
