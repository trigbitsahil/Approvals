using System.Threading.Tasks;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Contracts.Persistence.Global
{
    public interface IApprovalRetentionSettingRepository : IAsyncRepository<ApprovalRetentionSetting>
    {
        Task<ApprovalRetentionSetting?> GetActiveSettingAsync(string? tenantId = null);
        Task<(int deletedApprovals, int deletedTransactions)> PurgeExpiredApprovalsAsync(int retentionDays, string? tenantId = null);
    }
}
