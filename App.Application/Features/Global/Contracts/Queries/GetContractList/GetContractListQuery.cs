using MediatR;
using OOH.Application.Contracts.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Contracts.Queries.GetContractList
{
    public class ContractListVM
    {
        [JsonPropertyName("contractID")]
        public string ContractId { get; set; }

        [JsonPropertyName("contractNo")]
        public string? ContractNo { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("govtBodyID")]
        public string? GovtBodyId { get; set; }

        [JsonPropertyName("contractStartDate")]
        public DateTime? ContractStartDate { get; set; }

        [JsonPropertyName("contractEndDate")]
        public DateTime? ContractEndDate { get; set; }

        [JsonPropertyName("isVoided")]
        public bool IsVoided { get; set; }

        [JsonPropertyName("createdBy")]
        public string? CreatedBy { get; set; }

        [JsonPropertyName("createdDate")]
        public DateTime? CreatedDate { get; set; }

        [JsonPropertyName("lastModifiedBy")]
        public string? LastModifiedBy { get; set; }

        [JsonPropertyName("lastModifiedDate")]
        public DateTime? LastModifiedDate { get; set; }

        [JsonPropertyName("cityName")]
        public string? CityName { get; set; }

        [JsonPropertyName("govtBodyName")]
        public string? GovtBodyName { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        public string? Number => ContractNo;
    }

    public class GetContractListQuery : IRequest<List<ContractListVM>>
    {
    }

    public class GetContractListQueryHandler : IRequestHandler<GetContractListQuery, List<ContractListVM>>
    {
        private readonly IExternalApiClientService _externalApiClientService;

        public GetContractListQueryHandler(IExternalApiClientService externalApiClientService)
        {
            _externalApiClientService = externalApiClientService;
        }

        public async Task<List<ContractListVM>> Handle(GetContractListQuery request, CancellationToken cancellationToken)
        {
            var externalContracts = await _externalApiClientService.GetContractsAsync(cancellationToken);
            return externalContracts ?? new List<ContractListVM>();
        }
    }
}
