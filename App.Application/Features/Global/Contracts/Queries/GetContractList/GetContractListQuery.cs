using MediatR;
using OOH.Application.Contracts.Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Contracts.Queries.GetContractList
{
    public class ContractListVM
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

    public class GetContractListQuery : IRequest<List<ContractListVM>>
    {
    }

    public class GetContractListQueryHandler : IRequestHandler<GetContractListQuery, List<ContractListVM>>
    {
        private readonly IContractRepository _contractRepository;

        public GetContractListQueryHandler(IContractRepository contractRepository)
        {
            _contractRepository = contractRepository;
        }

        public async Task<List<ContractListVM>> Handle(GetContractListQuery request, CancellationToken cancellationToken)
        {
            var contracts = await _contractRepository.ListAllAsync();
            return contracts.Where(c => !c.IsVoided).Select(c => new ContractListVM
            {
                ContractId = c.ContractId,
                Name = c.Name,
                Number = c.Number,
                IsVoided = c.IsVoided,
                CreatedBy = c.CreatedBy,
                CreatedDate = c.CreatedDate,
                LastModifiedBy = c.LastModifiedBy,
                LastModifiedDate = c.LastModifiedDate
            }).ToList();
        }
    }
}
