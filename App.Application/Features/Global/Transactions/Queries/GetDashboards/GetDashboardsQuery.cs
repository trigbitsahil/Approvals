using MediatR;
using System.Collections.Generic;

namespace OOH.Application.Features.Global.Transactions.Queries.GetDashboards
{
    public class GetDashboardsQuery : IRequest<DashboardDto>
    {
        public bool HasActualViewPermission { get; set; }
    }

    public class DashboardDto
    {
        public int TotalTransactions { get; set; }
        public int TransactionsInProgress { get; set; }
        public decimal FundsInProgress { get; set; }
        public List<RecentTransactionDto> RecentTransactions { get; set; }
    }

    public class RecentTransactionDto
    {
        public string TransactionId { get; set; }
        public string Status { get; set; }
        public string DisplayAmount { get; set; }
    }
}
