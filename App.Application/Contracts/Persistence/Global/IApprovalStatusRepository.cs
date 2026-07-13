using OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusList;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Contracts.Persistence
{

    public interface IApprovalStatusRepository : IAsyncRepository<ApprovalStatus>
    {
        Task<List<ApprovalStatusListVM>> ListAllApprovalStatussAsync(string category, string categoryID);
    }

}
