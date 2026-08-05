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
                    .Where(t => t.FromBankId == bank.BankId || t.ToBankId == bank.BankId)
                    .OrderBy(x => x.CreatedDate)
                    .ToList();

                decimal runningBalance = 0;

                foreach (var t in bankTransactions)
                {
                    bool isWithdrawal = t.FromBankId == bank.BankId;
                    bool isDeposit = t.ToBankId == bank.BankId;

                    decimal currentWithdrawal = isWithdrawal ? t.Amount : 0;
                    decimal currentDeposit = isDeposit ? t.Amount : 0;

                    runningBalance = runningBalance + currentDeposit - currentWithdrawal;

                    string approvalName = null;
                    if (!string.IsNullOrEmpty(t.ApprovalId) && t.ApprovalId != "-")
                    {
                        var approval = approvals.FirstOrDefault(a => a.ApprovalId == t.ApprovalId);
                        if (approval != null && !string.IsNullOrEmpty(approval.Name))
                        {
                            try
                            {
                                approvalName = _encryptionService.Decrypt(approval.Name);
                            }
                            catch
                            {
                                approvalName = approval.Name;
                            }
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
                        TransactionType = isWithdrawal ? "Debit" : (isDeposit ? "Credit" : t.TransactionType),
                        Amount = t.Amount,
                        Deposit = currentDeposit,
                        Withdrawal = currentWithdrawal,
                        RunningBalance = t.RunningBalance != 0 ? t.RunningBalance : runningBalance,
                        CreatedDate = t.CreatedDate.ToString("o"),
                        CreatedBy = t.CreatedBy
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
