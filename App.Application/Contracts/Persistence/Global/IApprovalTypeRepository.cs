using OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeList;
using OOH.Domain.Entities;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Contracts.Persistence
{

    public interface IApprovalTypeRepository : IAsyncRepository<ApprovalType>
    {
        Task<List<ApprovalTypeListVM>> ListAllApprovalTypesAsync(string category, string categoryID);
    }

}
