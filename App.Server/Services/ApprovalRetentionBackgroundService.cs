using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.PurgeExpiredApprovals;

namespace OOH.API.Services
{
    public class ApprovalRetentionBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<ApprovalRetentionBackgroundService> _logger;

        public ApprovalRetentionBackgroundService(
            IServiceScopeFactory scopeFactory,
            ILogger<ApprovalRetentionBackgroundService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Approval Retention Background Service started.");

            // Initial startup delay to allow server and database warm up
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
            catch (OperationCanceledException)
            {
                return;
            }

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Running scheduled approval retention purge check...");

                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
                        var response = await mediator.Send(new PurgeExpiredApprovalsCommand(), stoppingToken);

                        if (response.Success && response.Data != null)
                        {
                            _logger.LogInformation(
                                "Scheduled approval retention purge completed: {Approvals} approvals and {Transactions} bank transactions purged (retention days: {Days}, cutoff: {Cutoff:yyyy-MM-dd HH:mm:ss} UTC).",
                                response.Data.DeletedApprovalsCount,
                                response.Data.DeletedBankTransactionsCount,
                                response.Data.RetentionDaysUsed,
                                response.Data.CutoffDateUtc);
                        }
                        else
                        {
                            _logger.LogWarning("Scheduled approval retention purge reported: {Message}", response.Message);
                        }
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Unexpected error in Approval Retention Background Service.");
                }

                // Run check every 12 hours
                try
                {
                    await Task.Delay(TimeSpan.FromHours(12), stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
            }

            _logger.LogInformation("Approval Retention Background Service stopped.");
        }
    }
}
