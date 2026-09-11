using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByVendorId
{
    public class GetBankTransactionsByVendorIdQueryHandler : IRequestHandler<GetBankTransactionsByVendorIdQuery, GetBankTransactionsListQueryResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly IDistributorRepository _distributorRepository;
        private readonly IEncryptionService _encryptionService;

        public GetBankTransactionsByVendorIdQueryHandler(
            IBankTransactionRepository bankTransactionRepository,
            IBankRepository bankRepository,
            IApprovalRepository approvalRepository,
            IDistributorRepository distributorRepository,
            IEncryptionService encryptionService)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _approvalRepository = approvalRepository;
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

        public async Task<GetBankTransactionsListQueryResponse> Handle(GetBankTransactionsByVendorIdQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _bankTransactionRepository.ListAllAsync();
            var banks = await _bankRepository.ListAllAsync();
            var approvals = await _approvalRepository.ListAllAsync();
            var distributors = await _distributorRepository.ListAllAsync();

            var vendorTxs = transactions
                .Where(t => (t.VendorId == request.VendorId || approvals.Any(a => a.ApprovalId == t.ApprovalId && a.VendorId == request.VendorId))
                            && (t.IsPaidToDistributor || t.IsConfirm)
                            && !t.IsVoided)
                .OrderByDescending(t => !string.IsNullOrEmpty(t.FromBankId))
                .ThenByDescending(t => t.CreatedDate)
                .GroupBy(t => string.IsNullOrEmpty(t.ApprovalId) ? t.TransactionId : t.ApprovalId)
                .Select(g => g.First())
                .ToList();

            var dtos = new List<BankTransactionListVM>();

            foreach (var t in vendorTxs)
            {
                var approval = approvals.FirstOrDefault(a => a.ApprovalId == t.ApprovalId);
                var fromBank = banks.FirstOrDefault(b => b.BankId == (t.FromBankId ?? approval?.FromBankId));
                var toBank = banks.FirstOrDefault(b => b.BankId == (t.ToBankId ?? approval?.ToBankId));
                var distId = t.DistributorId ?? approval?.DistributorId;
                var distributor = distributors.FirstOrDefault(d => d.DistributorId == distId);

                string approvalName = approval != null ? SafeDecrypt(approval.Name) : null;
                string approvalRef = approval != null ? SafeDecrypt(approval.Reference) : null;
                string fromBankName = SafeDecrypt(fromBank?.Name);
                string toBankName = SafeDecrypt(toBank?.Name);
                string distributorName = SafeDecrypt(distributor?.Name);

                string fromBankUser = fromBank?.UserId;

                string paidBy = !string.IsNullOrEmpty(fromBankUser)
                    ? fromBankUser
                    : ((t.IsPaidToDistributor && !t.IsConfirm && !string.IsNullOrEmpty(t.LastModifiedBy) && t.LastModifiedBy.Contains("@"))
                        ? t.LastModifiedBy
                        : t.CreatedBy);

                string paidDate = (t.IsPaidToDistributor && !t.IsConfirm && t.LastModifiedDate.HasValue)
                    ? t.LastModifiedDate.Value.ToString("o")
                    : t.CreatedDate.ToString("o");

                dtos.Add(new BankTransactionListVM
                {
                    TransactionId = t.TransactionId,
                    ApprovalId = t.ApprovalId,
                    ApprovalName = approvalName,
                    ApprovalReference = approvalRef,
                    VendorId = t.VendorId ?? approval?.VendorId,
                    DistributorId = distId,
                    DistributorName = distributorName,
                    FromBankId = t.FromBankId ?? approval?.FromBankId,
                    ToBankId = t.ToBankId ?? approval?.ToBankId,
                    FromBankUserEmail = fromBankUser,
                    PaidToDistributorBy = paidBy,
                    PaidToDistributorDate = paidDate,
                    BankName = fromBankName ?? toBankName,
                    FromBankName = fromBankName,
                    ToBankName = toBankName,
                    TransactionType = t.TransactionType,
                    Amount = t.Amount,
                    Deposit = t.Deposit,
                    Withdrawal = t.Withdrawal,
                    RunningBalance = t.RunningBalance,
                    IsPaidToDistributor = t.IsPaidToDistributor,
                    IsConfirm = t.IsConfirm,
                    Remarks = t.Remarks,
                    CreatedDate = t.CreatedDate.ToString("o"),
                    CreatedBy = t.CreatedBy,
                    LastModifiedDate = t.LastModifiedDate?.ToString("o"),
                    LastModifiedBy = t.LastModifiedBy
                });
            }

            return new GetBankTransactionsListQueryResponse
            {
                Success = true,
                Data = dtos
            };
        }
    }
}
