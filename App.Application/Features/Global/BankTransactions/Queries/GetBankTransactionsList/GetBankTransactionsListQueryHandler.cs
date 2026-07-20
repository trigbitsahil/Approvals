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
        private readonly OOH.Application.Contracts.Infrastructure.ILoggedInUserService _loggedInUserService;

        public GetBankTransactionsListQueryHandler(IBankTransactionRepository bankTransactionRepository, IBankRepository bankRepository, OOH.Application.Contracts.Infrastructure.ILoggedInUserService loggedInUserService)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _loggedInUserService = loggedInUserService;
        }

        public async Task<GetBankTransactionsListQueryResponse> Handle(GetBankTransactionsListQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _bankTransactionRepository.ListAllAsync();
            var banks = await _bankRepository.ListAllAsync();
            
            if (!string.Equals(_loggedInUserService.UserRole, "superadmin", System.StringComparison.OrdinalIgnoreCase))
            {
                var userBanks = banks.Where(b => b.UserId == _loggedInUserService.UserId).ToList();
                if (userBanks.Any())
                {
                    banks = userBanks;
                }
            }

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

                    dtos.Add(new BankTransactionListVM
                    {
                        TransactionId = t.TransactionId,
                        BankId = bank.BankId,
                        VendorId = t.VendorId,
                        BankName = bank.Name,
                        ApprovalId = t.ApprovalId,
                        TransactionType = isWithdrawal ? "Debit" : (isDeposit ? "Credit" : t.TransactionType),
                        Amount = t.Amount,
                        Deposit = currentDeposit,
                        Withdrawal = currentWithdrawal,
                        RunningBalance = runningBalance,
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
