using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorSummary
{
    public class GetDistributorSummaryQueryHandler : IRequestHandler<GetDistributorSummaryQuery, GetDistributorSummaryQueryResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IApprovalRepository _approvalRepository;

        public GetDistributorSummaryQueryHandler(
            IBankTransactionRepository bankTransactionRepository,
            IApprovalRepository approvalRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _approvalRepository = approvalRepository;
        }

        public async Task<GetDistributorSummaryQueryResponse> Handle(GetDistributorSummaryQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _bankTransactionRepository.ListAllAsync();
            var approvals = await _approvalRepository.ListAllAsync();

            var distId = request.DistributorId;

            // Find all active transactions strictly belonging to this distributor's ledger
            var distTxs = transactions
                .Where(t => !t.IsVoided && 
                            (t.TransactionType == "Refund" || t.IsPaidToDistributor || t.IsConfirm) &&
                            (t.ToBankId == distId || 
                             t.FromBankId == distId || 
                             (t.DistributorId == distId && string.IsNullOrEmpty(t.FromBankId) && (t.ToBankId == null || t.ToBankId == distId || t.ToBankId.StartsWith("Dstrbtr_", System.StringComparison.OrdinalIgnoreCase)))))
                .ToList();

            // Group transactions by ApprovalId
            var approvalGroups = distTxs
                .Where(t => !string.IsNullOrEmpty(t.ApprovalId) && t.ApprovalId != "-")
                .GroupBy(t => t.ApprovalId)
                .ToList();

            decimal totalReceived = 0;
            decimal totalPaid = 0;

            foreach (var g in approvalGroups)
            {
                var depTx = g.FirstOrDefault(t => (t.ToBankId == distId || (string.IsNullOrEmpty(t.FromBankId) && (t.ToBankId == null || t.ToBankId == distId || t.ToBankId.StartsWith("Dstrbtr_", System.StringComparison.OrdinalIgnoreCase)))) && t.TransactionType != "Refund" && t.Deposit > 0)
                            ?? g.FirstOrDefault(t => t.TransactionType != "Refund");

                decimal depAmt = depTx?.Deposit > 0 ? depTx.Deposit : (depTx?.Amount ?? 0);
                totalReceived += depAmt;

                decimal confSpent = (depTx != null && depTx.IsConfirm) ? depTx.Withdrawal : 0;
                decimal refundAmt = g.Where(t => t.TransactionType == "Refund" || t.FromBankId == distId).Sum(t => t.Amount);

                decimal effectiveWithdrawn = Math.Max(depTx?.Withdrawal ?? 0, confSpent + refundAmt);
                if (depAmt > 0 && effectiveWithdrawn > depAmt)
                {
                    effectiveWithdrawn = depAmt;
                }

                totalPaid += effectiveWithdrawn;
            }

            // Standalone transactions without an ApprovalId
            var standaloneTxs = distTxs.Where(t => string.IsNullOrEmpty(t.ApprovalId) || t.ApprovalId == "-").ToList();
            totalReceived += standaloneTxs.Where(t => t.ToBankId == distId || (t.DistributorId == distId && t.TransactionType != "Refund")).Sum(t => t.Deposit > 0 ? t.Deposit : t.Amount);
            totalPaid += standaloneTxs.Where(t => t.FromBankId == distId || t.TransactionType == "Refund").Sum(t => t.Withdrawal > 0 ? t.Withdrawal : t.Amount);

            decimal runningBalance = Math.Max(0, totalReceived - totalPaid);
            int totalCount = approvalGroups.Count + standaloneTxs.Count;

            return new GetDistributorSummaryQueryResponse
            {
                Success = true,
                Data = new DistributorSummaryVM
                {
                    DistributorId = request.DistributorId,
                    TotalReceivedAmount = totalReceived,
                    TotalPaidAmount = totalPaid,
                    RunningBalance = runningBalance,
                    TotalTransactionsCount = totalCount
                }
            };
        }
    }
}
