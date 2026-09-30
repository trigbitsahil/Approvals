using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Vendors.Queries.GetVendorSummary
{
    public class GetVendorSummaryQueryHandler : IRequestHandler<GetVendorSummaryQuery, GetVendorSummaryQueryResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly OOH.Application.Contracts.Persistence.Global.IBankRetentionBalanceRepository _bankRetentionBalanceRepository;

        public GetVendorSummaryQueryHandler(
            IBankTransactionRepository bankTransactionRepository,
            IApprovalRepository approvalRepository,
            OOH.Application.Contracts.Persistence.Global.IBankRetentionBalanceRepository bankRetentionBalanceRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _approvalRepository = approvalRepository;
            _bankRetentionBalanceRepository = bankRetentionBalanceRepository;
        }

        public async Task<GetVendorSummaryQueryResponse> Handle(GetVendorSummaryQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _bankTransactionRepository.ListAllAsync();
            var approvals = await _approvalRepository.ListAllAsync();

            var vendorTxs = transactions
                .Where(t => (t.VendorId == request.VendorId || approvals.Any(a => a.ApprovalId == t.ApprovalId && a.VendorId == request.VendorId))
                            && (t.IsPaidToDistributor || t.IsConfirm)
                            && !t.IsVoided)
                .OrderByDescending(t => !string.IsNullOrEmpty(t.FromBankId))
                .ThenByDescending(t => t.CreatedDate)
                .GroupBy(t => string.IsNullOrEmpty(t.ApprovalId) ? t.TransactionId : t.ApprovalId)
                .Select(g => g.First())
                .ToList();

            decimal totalPaid = vendorTxs.Where(t => t.IsConfirm).Sum(t => t.Amount);
            decimal pendingAmount = vendorTxs.Where(t => !t.IsConfirm).Sum(t => t.Amount);

            if (_bankRetentionBalanceRepository != null)
            {
                var ret = await _bankRetentionBalanceRepository.GetByBankIdAsync(request.VendorId, entityType: "Vendor");
                decimal retentionPaid = ret?.TotalWithdrawal ?? ret?.RunningBalance ?? 0;
                totalPaid += retentionPaid;
            }

            return new GetVendorSummaryQueryResponse
            {
                Success = true,
                Data = new VendorSummaryVM
                {
                    VendorId = request.VendorId,
                    TotalPaidAmount = totalPaid,
                    PendingAmount = pendingAmount,
                    TotalTransactionsCount = vendorTxs.Count
                }
            };
        }
    }
}
