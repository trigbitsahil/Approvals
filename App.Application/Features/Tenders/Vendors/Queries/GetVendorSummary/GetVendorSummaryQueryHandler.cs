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

        public GetVendorSummaryQueryHandler(
            IBankTransactionRepository bankTransactionRepository,
            IApprovalRepository approvalRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _approvalRepository = approvalRepository;
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
