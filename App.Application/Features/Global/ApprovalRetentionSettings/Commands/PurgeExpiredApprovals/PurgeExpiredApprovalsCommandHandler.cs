using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.PurgeExpiredApprovals
{
    public class PurgeExpiredApprovalsCommandHandler : IRequestHandler<PurgeExpiredApprovalsCommand, PurgeExpiredApprovalsCommandResponse>
    {
        private readonly IApprovalRetentionSettingRepository _repository;
        private readonly ILoggedInUserService _loggedInUserService;
        private readonly ILogger<PurgeExpiredApprovalsCommandHandler> _logger;

        public PurgeExpiredApprovalsCommandHandler(
            IApprovalRetentionSettingRepository repository,
            ILoggedInUserService loggedInUserService,
            ILogger<PurgeExpiredApprovalsCommandHandler> logger)
        {
            _repository = repository;
            _loggedInUserService = loggedInUserService;
            _logger = logger;
        }

        public async Task<PurgeExpiredApprovalsCommandResponse> Handle(PurgeExpiredApprovalsCommand request, CancellationToken cancellationToken)
        {
            var response = new PurgeExpiredApprovalsCommandResponse();

            try
            {
                string? tenantId = request.TenantId ?? _loggedInUserService.TenantId;

                var setting = await _repository.GetActiveSettingAsync(tenantId);

                int retentionDays = 0;
                if (request.OverrideRetentionDays.HasValue && request.OverrideRetentionDays.Value > 0)
                {
                    retentionDays = request.OverrideRetentionDays.Value;
                }
                else if (setting != null)
                {
                    if (!setting.IsActive)
                    {
                        response.Success = true;
                        response.Message = "Approval retention auto-deletion is currently disabled in settings.";
                        return response;
                    }
                    retentionDays = setting.RetentionDays;
                }
                else
                {
                    response.Success = false;
                    response.Message = "No active retention setting found in database. Please configure retention days in the database table first.";
                    return response;
                }

                if (retentionDays <= 0)
                {
                    response.Success = false;
                    response.Message = "Invalid retention days value.";
                    return response;
                }

                var (deletedApprovals, deletedTransactions) = await _repository.PurgeExpiredApprovalsAsync(retentionDays, tenantId);

                DateTime cutoff = DateTime.UtcNow.AddDays(-retentionDays);

                response.Success = true;
                response.Message = $"Successfully purged {deletedApprovals} approval(s) and {deletedTransactions} bank transaction(s) older than {retentionDays} days (before {cutoff:yyyy-MM-dd HH:mm:ss} UTC).";
                response.Data = new PurgeResultVM
                {
                    DeletedApprovalsCount = deletedApprovals,
                    DeletedBankTransactionsCount = deletedTransactions,
                    RetentionDaysUsed = retentionDays,
                    CutoffDateUtc = cutoff,
                    ExecutedAtUtc = DateTime.UtcNow
                };

                _logger.LogInformation("Approval retention purge completed: {Approvals} approvals and {Transactions} bank transactions deleted (retention: {Days} days, cutoff: {Cutoff})",
                    deletedApprovals, deletedTransactions, retentionDays, cutoff);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to purge expired approvals: {Message}", ex.Message);
                response.Success = false;
                response.Message = $"Failed to purge expired approvals: {ex.Message}";
            }

            return response;
        }
    }
}
