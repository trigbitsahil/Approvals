using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList
{
    public class GetBankTransactionsListQueryHandler : IRequestHandler<GetBankTransactionsListQuery, GetBankTransactionsListQueryResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly OOH.Application.Contracts.Infrastructure.ILoggedInUserService _loggedInUserService;
        private readonly OOH.Application.Contracts.Infrastructure.IEncryptionService _encryptionService;

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

        public GetBankTransactionsListQueryHandler(IBankTransactionRepository bankTransactionRepository, IBankRepository bankRepository, IApprovalRepository approvalRepository, OOH.Application.Contracts.Infrastructure.ILoggedInUserService loggedInUserService, OOH.Application.Contracts.Infrastructure.IEncryptionService encryptionService)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _approvalRepository = approvalRepository;
            _loggedInUserService = loggedInUserService;
            _encryptionService = encryptionService;
        }

        public async Task<GetBankTransactionsListQueryResponse> Handle(GetBankTransactionsListQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _bankTransactionRepository.ListAllAsync();
            var banks = await _bankRepository.ListAllAsync();
            var approvals = await _approvalRepository.ListAllAsync();
            


            var dtos = new System.Collections.Generic.List<BankTransactionListVM>();

            foreach (var bank in banks)
            {
                var bankTransactions = transactions
                    .Where(t => !t.IsVoided && (
                        (t.FromBankId == bank.BankId && (t.IsPaidToDistributor || t.IsConfirm)) ||
                        (t.ToBankId == bank.BankId && (t.IsConfirm || t.TransactionType == "Refund"))
                    ))
                    .OrderBy(x => x.CreatedDate)
                    .ToList();


                decimal runningBalance = 0;

                foreach (var t in bankTransactions)
                {
                    bool isWithdrawal = t.FromBankId == bank.BankId;
                    bool isDeposit = t.ToBankId == bank.BankId;

                    decimal currentWithdrawal = isWithdrawal ? (t.Withdrawal > 0 ? t.Withdrawal : t.Amount) : 0;
                    decimal currentDeposit = isDeposit ? (t.Deposit > 0 ? t.Deposit : t.Amount) : 0;

                    runningBalance = runningBalance + currentDeposit - currentWithdrawal;

                    if (t.RunningBalance != runningBalance)
                    {
                        t.RunningBalance = runningBalance;
                        await _bankTransactionRepository.UpdateAsync(t);
                    }

                    string approvalName = null;
                    string approvalReference = null;
                    if (!string.IsNullOrEmpty(t.ApprovalId) && t.ApprovalId != "-")
                    {
                        var approval = approvals.FirstOrDefault(a => a.ApprovalId == t.ApprovalId);
                        if (approval != null)
                        {
                            approvalName = SafeDecrypt(approval.Name);
                            approvalReference = SafeDecrypt(approval.Reference);
                        }
                    }

                    dtos.Add(new BankTransactionListVM
                    {
                        TransactionId = t.TransactionId,
                        BankId = bank.BankId,
                        VendorId = t.VendorId,
                        BankName = SafeDecrypt(bank.Name),
                        ApprovalId = t.ApprovalId,
                        ApprovalName = approvalName,
                        ApprovalReference = approvalReference,
                        TransactionType = isWithdrawal ? "Debit" : (isDeposit ? "Credit" : t.TransactionType),
                        Amount = t.Amount,
                        Deposit = currentDeposit,
                        Withdrawal = currentWithdrawal,
                        RunningBalance = runningBalance,
                        IsConfirm = t.IsConfirm,
                        IsPaidToDistributor = t.IsPaidToDistributor,
                        IsPartialAmount = t.IsPartialAmount,
                        FromBankId = t.FromBankId,
                        ToBankId = t.ToBankId,
                        Remarks = t.Remarks,
                        CreatedDate = t.CreatedDate.ToString("o"),
                        CreatedBy = t.CreatedBy,
                        LastModifiedDate = t.LastModifiedDate?.ToString("o"),
                        LastModifiedBy = t.LastModifiedBy
                    });
                }
            }

            var orderedDtos = dtos.OrderByDescending(x => System.DateTime.Parse(x.CreatedDate)).ToList();

            return new GetBankTransactionsListQueryResponse
            {
                Success = true,
                Data = orderedDtos
            };
        }
    }
}
