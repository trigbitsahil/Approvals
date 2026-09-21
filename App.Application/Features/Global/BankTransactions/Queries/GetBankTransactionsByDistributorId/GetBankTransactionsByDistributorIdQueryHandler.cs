using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDistributorId
{
    public class GetBankTransactionsByDistributorIdQueryHandler : IRequestHandler<GetBankTransactionsByDistributorIdQuery, GetBankTransactionsByDistributorIdQueryResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly OOH.Application.Contracts.Persistence.Tenders.IVendorRepository _vendorRepository;
        private readonly IEncryptionService _encryptionService;

        public GetBankTransactionsByDistributorIdQueryHandler(
            IBankTransactionRepository bankTransactionRepository,
            IBankRepository bankRepository,
            IApprovalRepository approvalRepository,
            OOH.Application.Contracts.Persistence.Tenders.IVendorRepository vendorRepository,
            IEncryptionService encryptionService)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _approvalRepository = approvalRepository;
            _vendorRepository = vendorRepository;
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

        public async Task<GetBankTransactionsByDistributorIdQueryResponse> Handle(GetBankTransactionsByDistributorIdQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _bankTransactionRepository.ListAllAsync();
            var banks = await _bankRepository.ListAllAsync();
            var approvals = await _approvalRepository.ListAllAsync();
            var vendors = await _vendorRepository.ListAllAsync();

            var query = transactions
                .Where(t => !t.IsVoided && (t.IsPaidToDistributor || t.IsConfirm) &&
                            (t.ToBankId == request.DistributorId || 
                             t.FromBankId == request.DistributorId || 
                             (t.TransactionType == "Refund" && (t.DistributorId == request.DistributorId || t.FromBankId == request.DistributorId)) || 
                             (t.DistributorId == request.DistributorId && string.IsNullOrEmpty(t.FromBankId) && (t.ToBankId == null || t.ToBankId == request.DistributorId || t.ToBankId.StartsWith("Dstrbtr_", System.StringComparison.OrdinalIgnoreCase)))));

            if (!string.IsNullOrWhiteSpace(request.Status) && !request.Status.Equals("all", System.StringComparison.OrdinalIgnoreCase))
            {
                if (request.Status.Equals("pending", System.StringComparison.OrdinalIgnoreCase) || request.Status.Equals("received", System.StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(t => t.IsPaidToDistributor && !t.IsConfirm);
                }
                else if (request.Status.Equals("paid", System.StringComparison.OrdinalIgnoreCase) || request.Status.Equals("completed", System.StringComparison.OrdinalIgnoreCase) || request.Status.Equals("settled", System.StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(t => t.IsConfirm);
                }
            }

            var distributorTxs = query
                .OrderByDescending(t => string.IsNullOrEmpty(t.FromBankId) || t.ToBankId == request.DistributorId)
                .ThenByDescending(t => t.CreatedDate)
                .GroupBy(t => string.IsNullOrEmpty(t.ApprovalId) ? t.TransactionId : t.ApprovalId)
                .Select(g => new
                {
                    Primary = g.FirstOrDefault(t => (t.ToBankId == request.DistributorId || (string.IsNullOrEmpty(t.FromBankId) && (t.ToBankId == null || t.ToBankId == request.DistributorId || t.ToBankId.StartsWith("Dstrbtr_", System.StringComparison.OrdinalIgnoreCase)))) && t.TransactionType != "Refund") ?? g.First(),
                    RefundAmount = g.Where(x => x.TransactionType == "Refund" && !x.IsVoided).Sum(x => x.Amount)
                })
                .ToList();

            var dtos = new List<BankTransactionByDistributorIdVM>();

            foreach (var item in distributorTxs)
            {
                var t = item.Primary;
                var approval = approvals.FirstOrDefault(a => a.ApprovalId == t.ApprovalId);
                var fromBank = banks.FirstOrDefault(b => b.BankId == (t.FromBankId ?? approval?.FromBankId));
                var toBank = banks.FirstOrDefault(b => b.BankId == (t.ToBankId ?? approval?.ToBankId));
                var vendor = vendors.FirstOrDefault(v => v.VendorId == (t.VendorId ?? approval?.VendorId));

                string approvalName = approval != null ? SafeDecrypt(approval.Name) : null;
                string approvalRef = approval != null ? SafeDecrypt(approval.Reference) : null;
                string fromBankName = SafeDecrypt(fromBank?.Name);
                string toBankName = SafeDecrypt(toBank?.Name);
                string vendorName = SafeDecrypt(vendor?.Name);

                string fromBankUser = fromBank?.UserId;

                string paidBy = !string.IsNullOrEmpty(fromBankUser)
                    ? fromBankUser
                    : ((t.IsPaidToDistributor && !t.IsConfirm && !string.IsNullOrEmpty(t.LastModifiedBy) && t.LastModifiedBy.Contains("@"))
                        ? t.LastModifiedBy
                        : t.CreatedBy);

                string paidDate = (t.IsPaidToDistributor && !t.IsConfirm && t.LastModifiedDate.HasValue)
                    ? t.LastModifiedDate.Value.ToString("o")
                    : t.CreatedDate.ToString("o");

                dtos.Add(new BankTransactionByDistributorIdVM
                {
                    TransactionId = t.TransactionId,
                    ApprovalId = t.ApprovalId,
                    ApprovalName = approvalName,
                    ApprovalReference = approvalRef,
                    DistributorId = t.DistributorId,
                    FromBankId = t.FromBankId ?? approval?.FromBankId,
                    ToBankId = t.ToBankId ?? approval?.ToBankId,
                    FromBankUserEmail = fromBankUser,
                    PaidToDistributorBy = paidBy,
                    PaidToDistributorDate = paidDate,
                    VendorId = t.VendorId ?? approval?.VendorId,
                    BankName = fromBankName ?? toBankName,
                    FromBankName = fromBankName,
                    ToBankName = toBankName,
                    VendorName = vendorName,
                    TransactionType = t.TransactionType,
                    Amount = t.Amount,
                    Deposit = t.Deposit > 0 ? t.Deposit : t.Amount,
                    Withdrawal = t.Withdrawal,
                    RefundAmount = item.RefundAmount,
                    RunningBalance = t.RunningBalance,
                    IsPaidToDistributor = t.IsPaidToDistributor,
                    IsConfirm = t.IsConfirm,
                    IsPartialAmount = t.IsPartialAmount,
                    Remarks = t.Remarks,
                    CreatedDate = t.CreatedDate.ToString("o"),
                    CreatedBy = t.CreatedBy,
                    LastModifiedDate = t.LastModifiedDate?.ToString("o"),
                    LastModifiedBy = t.LastModifiedBy
                });
            }

            return new GetBankTransactionsByDistributorIdQueryResponse
            {
                Success = true,
                Data = dtos
            };
        }
    }
}
