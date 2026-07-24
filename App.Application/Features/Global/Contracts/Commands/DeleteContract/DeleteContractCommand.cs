using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Contracts.Commands.DeleteContract
{
    public class DeleteContractCommand : IRequest<Unit>
    {
        public string ContractId { get; set; }
    }

    public class DeleteContractCommandHandler : IRequestHandler<DeleteContractCommand, Unit>
    {
        private readonly IContractRepository _contractRepository;

        public DeleteContractCommandHandler(IContractRepository contractRepository)
        {
            _contractRepository = contractRepository;
        }

        public async Task<Unit> Handle(DeleteContractCommand request, CancellationToken cancellationToken)
        {
            var contractToDelete = await _contractRepository.GetByIdForUpdateAsync(request.ContractId);

            if (contractToDelete == null)
            {
                throw new NotFoundException(nameof(Contract), request.ContractId);
            }

            contractToDelete.IsVoided = true;
            await _contractRepository.UpdateAsync(contractToDelete);

            return Unit.Value;
        }
    }
}
