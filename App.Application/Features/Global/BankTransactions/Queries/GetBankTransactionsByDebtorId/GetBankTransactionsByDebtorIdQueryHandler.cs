using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDebtorId
{
    public class GetBankTransactionsByDebtorIdQueryHandler : IRequestHandler<GetBankTransactionsByDebtorIdQuery, GetBankTransactionsByDebtorIdQueryResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly IEncryptionService _encryptionService;

        public GetBankTransactionsByDebtorIdQueryHandler(
            IBankTransactionRepository bankTransactionRepository,
            IBankRepository bankRepository,
            IApprovalRepository approvalRepository,
            IEncryptionService encryptionService)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _approvalRepository = approvalRepository;
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

        public async Task<GetBankTransactionsByDebtorIdQueryResponse> Handle(GetBankTransactionsByDebtorIdQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _bankTransactionRepository.ListAllAsync();
            var banks = await _bankRepository.ListAllAsync();
            var approvals = await _approvalRepository.ListAllAsync();

            var query = transactions
                .Where(t => (t.DebtorId == request.DebtorId || approvals.Any(a => a.ApprovalId == t.ApprovalId && a.DebtorId == request.DebtorId)) && !t.IsVoided);

            if (!string.IsNullOrWhiteSpace(request.Status) && !request.Status.Equals("all", System.StringComparison.OrdinalIgnoreCase))
            {
                if (request.Status.Equals("pending", System.StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(t => !t.IsConfirm);
                }
                else if (request.Status.Equals("paid", System.StringComparison.OrdinalIgnoreCase) || request.Status.Equals("received", System.StringComparison.OrdinalIgnoreCase) || request.Status.Equals("completed", System.StringComparison.OrdinalIgnoreCase) || request.Status.Equals("settled", System.StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(t => t.IsConfirm);
                }
            }

            var debtorTxs = query
                .OrderByDescending(t => !string.IsNullOrEmpty(t.FromBankId))
                .ThenByDescending(t => t.CreatedDate)
                .GroupBy(t => string.IsNullOrEmpty(t.ApprovalId) ? t.TransactionId : t.ApprovalId)
                .Select(g => g.First())
                .ToList();

            var dtos = new List<BankTransactionByDebtorIdVM>();

            foreach (var t in debtorTxs)
            {
                var approval = approvals.FirstOrDefault(a => a.ApprovalId == t.ApprovalId);
                var fromBank = banks.FirstOrDefault(b => b.BankId == (t.FromBankId ?? approval?.FromBankId));
                var toBank = banks.FirstOrDefault(b => b.BankId == (t.ToBankId ?? approval?.ToBankId));

                string approvalName = approval != null ? SafeDecrypt(approval.Name) : null;
                string approvalRef = approval != null ? SafeDecrypt(approval.Reference) : null;
                string fromBankName = SafeDecrypt(fromBank?.Name);
                string toBankName = SafeDecrypt(toBank?.Name);

                dtos.Add(new BankTransactionByDebtorIdVM
                {
                    TransactionId = t.TransactionId,
                    ApprovalId = t.ApprovalId,
                    ApprovalName = approvalName,
                    ApprovalReference = approvalRef,
                    DebtorId = t.DebtorId,
                    FromBankId = t.FromBankId ?? approval?.FromBankId,
                    ToBankId = t.ToBankId ?? approval?.ToBankId,
                    BankName = toBankName ?? fromBankName,
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

            return new GetBankTransactionsByDebtorIdQueryResponse
            {
                Success = true,
                Data = dtos
            };
        }
    }
}
