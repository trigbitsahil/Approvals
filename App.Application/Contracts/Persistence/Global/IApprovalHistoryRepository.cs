using OOH.Domain.Entities.Global;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OOH.Application.Contracts.Persistence
{
    public interface IApprovalHistoryRepository : IAsyncRepository<ApprovalHistory>
    {
        Task<List<ApprovalHistory>> GetByApprovalIdAsync(string approvalId);
        Task LogHistoryAsync(string approvalId, string action, string description, string performedBy = null, string performedByName = null, string remarks = null);
    }
}
