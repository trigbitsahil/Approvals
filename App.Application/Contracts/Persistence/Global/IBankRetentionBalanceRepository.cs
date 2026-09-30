using System.Collections.Generic;
using System.Threading.Tasks;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Contracts.Persistence.Global
{
    public interface IBankRetentionBalanceRepository : IAsyncRepository<BankRetentionBalance>
    {
        Task<BankRetentionBalance?> GetByBankIdAsync(string bankId, string? tenantId = null, string? entityType = null);
        Task<List<BankRetentionBalance>> GetAllRetentionBalancesAsync(string? tenantId = null, string? entityType = null);
        Task AccumulateRetentionBalanceAsync(string bankId, decimal deposit, decimal withdrawal, string tenantId, string? approvalId = null, string? entityType = "Bank");
    }
}
