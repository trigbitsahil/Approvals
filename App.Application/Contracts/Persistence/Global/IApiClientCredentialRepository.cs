using OOH.Domain.Entities.Global;
using System.Threading.Tasks;

namespace OOH.Application.Contracts.Persistence.Global
{
    public interface IApiClientCredentialRepository : IAsyncRepository<ApiClientCredential>
    {
        Task<ApiClientCredential?> GetLatestCredentialsAsync();
    }
}
