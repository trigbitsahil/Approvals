using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Contracts.Queries.GetContractDetail
{
    public class ContractDetailVM
    {
        public string ContractId { get; set; }
        public string Name { get; set; }
        public string? Number { get; set; }
        public bool IsVoided { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }

    public class GetContractDetailQuery : IRequest<ContractDetailVM>
    {
        public string ContractId { get; set; }
    }

    public class GetContractDetailQueryHandler : IRequestHandler<GetContractDetailQuery, ContractDetailVM>
    {
        private readonly IContractRepository _contractRepository;

        public GetContractDetailQueryHandler(IContractRepository contractRepository)
        {
            _contractRepository = contractRepository;
        }

        public async Task<ContractDetailVM> Handle(GetContractDetailQuery request, CancellationToken cancellationToken)
        {
            var contract = await _contractRepository.GetByIdAsync(request.ContractId);

            if (contract == null || contract.IsVoided)
            {
                throw new NotFoundException(nameof(Contract), request.ContractId);
            }

            return new ContractDetailVM
            {
                ContractId = contract.ContractId,
                Name = contract.Name,
                Number = contract.Number,
                IsVoided = contract.IsVoided,
                CreatedBy = contract.CreatedBy,
                CreatedDate = contract.CreatedDate,
                LastModifiedBy = contract.LastModifiedBy,
                LastModifiedDate = contract.LastModifiedDate
            };
        }
    }
}
