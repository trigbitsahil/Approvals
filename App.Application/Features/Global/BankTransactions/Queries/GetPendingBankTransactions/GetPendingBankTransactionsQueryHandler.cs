using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetPendingBankTransactions
{
    public class GetPendingBankTransactionsQueryHandler : IRequestHandler<GetPendingBankTransactionsQuery, GetPendingBankTransactionsQueryResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly IVendorRepository _vendorRepository;
        private readonly IDebtorRepository _debtorRepository;
        private readonly IDistributorRepository _distributorRepository;
        private readonly OOH.Application.Contracts.Infrastructure.IEncryptionService _encryptionService;

        public GetPendingBankTransactionsQueryHandler(
            IBankTransactionRepository bankTransactionRepository,
            IBankRepository bankRepository,
            IApprovalRepository approvalRepository,
            IVendorRepository vendorRepository,
            IDebtorRepository debtorRepository,
            IDistributorRepository distributorRepository,
            OOH.Application.Contracts.Infrastructure.IEncryptionService encryptionService)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _approvalRepository = approvalRepository;
            _vendorRepository = vendorRepository;
            _debtorRepository = debtorRepository;
            _distributorRepository = distributorRepository;
            _encryptionService = encryptionService;
        }

        private string SafeDecrypt(string value)
        {
            if (string.IsNullOrEmpty(value)) return value;
            try
            {
                return _encryptionService.Decrypt(value);
            }
            catch
            {
                return value;
            }
        }

        public async Task<GetPendingBankTransactionsQueryResponse> Handle(GetPendingBankTransactionsQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _bankTransactionRepository.ListAllAsync();
            var banks = await _bankRepository.ListAllAsync();
            var approvals = await _approvalRepository.ListAllAsync();
            var vendors = await _vendorRepository.ListAllAsync();
            var debtors = await _debtorRepository.ListAllAsync();
            var distributors = await _distributorRepository.ListAllAsync();

            // Filter for pending transactions where IsConfirm == false, preferring FromBank transaction
            var pendingTxs = transactions
                .Where(t => !t.IsConfirm && !t.IsVoided)
                .OrderByDescending(t => !string.IsNullOrEmpty(t.FromBankId))
                .ThenByDescending(t => t.CreatedDate)
                .GroupBy(t => string.IsNullOrEmpty(t.ApprovalId) ? t.TransactionId : t.ApprovalId)
                .Select(g => g.First())
                .ToList();

            var dtos = new List<PendingBankTransactionVM>();

            foreach (var tx in pendingTxs)
            {
                var approval = approvals.FirstOrDefault(a => a.ApprovalId == tx.ApprovalId);
                var fromBank = banks.FirstOrDefault(b => b.BankId == (tx.FromBankId ?? approval?.FromBankId));
                var toBank = banks.FirstOrDefault(b => b.BankId == (tx.ToBankId ?? approval?.ToBankId));
                var vendor = vendors.FirstOrDefault(v => v.VendorId == (tx.VendorId ?? approval?.VendorId));
                var debtor = debtors.FirstOrDefault(d => d.DebtorId == (tx.DebtorId ?? approval?.DebtorId));
                var distributor = distributors.FirstOrDefault(d => d.DistributorId == (tx.DistributorId ?? approval?.DistributorId));

                string approvalName = approval != null ? SafeDecrypt(approval.Name) : null;
                string approvalReference = approval != null ? SafeDecrypt(approval.Reference) : null;
                string approvalType = approval != null ? SafeDecrypt(approval.ApprovalType) : null;

                string derivedStatus;
                if (tx.IsConfirm)
                {
                    derivedStatus = "Completed";
                }
                else if (tx.IsPaidToDistributor)
                {
                    derivedStatus = "Paid to Distributor";
                }
                else
                {
                    derivedStatus = "Pending";
                }

                dtos.Add(new PendingBankTransactionVM
                {
                    TransactionId = tx.TransactionId,
                    ApprovalId = tx.ApprovalId,
                    ApprovalName = approvalName,
                    ApprovalReference = approvalReference,
                    ApprovalType = approvalType ?? tx.TransactionType,
                    TransactionType = tx.TransactionType,
                    FromBankId = fromBank?.BankId,
                    FromBankName = SafeDecrypt(fromBank?.Name),
                    AssignedBankUserId = fromBank?.UserId,
                    ToBankId = toBank?.BankId,
                    ToBankName = SafeDecrypt(toBank?.Name),
                    VendorId = vendor?.VendorId,
                    VendorName = SafeDecrypt(vendor?.Name),
                    DebtorId = debtor?.DebtorId,
                    DebtorName = SafeDecrypt(debtor?.Name),
                    DistributorId = distributor?.DistributorId,
                    DistributorName = SafeDecrypt(distributor?.Name),
                    Amount = tx.Amount,
                    IsPaidToDistributor = tx.IsPaidToDistributor,
                    IsConfirm = tx.IsConfirm,
                    Remarks = tx.Remarks,
                    CreatedDate = tx.CreatedDate.ToString("o"),
                    CreatedBy = tx.CreatedBy,
                    DerivedStatus = derivedStatus
                });
            }

            if (!string.IsNullOrWhiteSpace(request.ApprovalType) && !request.ApprovalType.Equals("all", System.StringComparison.OrdinalIgnoreCase))
            {
                var filterType = request.ApprovalType.Trim().ToLower();
                dtos = dtos.Where(d =>
                    (!string.IsNullOrEmpty(d.ApprovalType) && d.ApprovalType.ToLower().Contains(filterType)) ||
                    (!string.IsNullOrEmpty(d.TransactionType) && d.TransactionType.ToLower().Contains(filterType))
                ).ToList();
            }

            return new GetPendingBankTransactionsQueryResponse
            {
                Success = true,
                Data = dtos
            };
        }
    }
}
