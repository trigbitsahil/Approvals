using OOH.Application.Features.Global.Contracts.Queries.GetContractList;
using OOH.Application.Features.Global.Projects.Queries.GetProjectList;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Contracts.Infrastructure
{
    public interface IExternalApiClientService
    {
        Task<string?> GetAccessTokenAsync(CancellationToken cancellationToken = default);
        Task<List<ProjectListVM>> GetProjectsAsync(CancellationToken cancellationToken = default);
        Task<List<ContractListVM>> GetContractsAsync(CancellationToken cancellationToken = default);
    }
}
