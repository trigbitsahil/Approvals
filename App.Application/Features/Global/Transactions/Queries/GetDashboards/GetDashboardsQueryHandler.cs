using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Transactions;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Transactions.Queries.GetDashboards
{
    public class GetDashboardsQueryHandler : IRequestHandler<GetDashboardsQuery, DashboardDto>
    {
        private readonly IAsyncRepository<Transaction> _transactionRepository;

        public GetDashboardsQueryHandler(IAsyncRepository<Transaction> transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<DashboardDto> Handle(GetDashboardsQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _transactionRepository.ListAllAsync();
            var inProgress = transactions.Where(t => t.Status != "Completed" && t.Status != "Rejected").ToList();

            var totalFunds = inProgress.Sum(t => t.Amount);
            var fundsInProgress = request.HasActualViewPermission ? totalFunds : MaskAmount(totalFunds);

            return new DashboardDto
            {
                TotalTransactions = transactions.Count,
                TransactionsInProgress = inProgress.Count,
                FundsInProgress = fundsInProgress,
                RecentTransactions = transactions.OrderByDescending(t => t.CreatedDate).Take(10).Select(t => new RecentTransactionDto
                {
                    TransactionId = t.TransactionId,
                    Status = t.Status,
                    DisplayAmount = request.HasActualViewPermission ? t.Amount.ToString("N2") : MaskAmount(t.Amount).ToString("N2")
                }).ToList()
            };
        }

        private decimal MaskAmount(decimal originalAmount)
        {
            if (originalAmount >= 1000)
            {
                return originalAmount / 1000m;
            }
            return originalAmount;
        }
    }
}
