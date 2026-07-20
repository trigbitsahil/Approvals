using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionById
{
    public class GetBankTransactionByIdQueryHandler : IRequestHandler<GetBankTransactionByIdQuery, GetBankTransactionsListQueryResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;

        public GetBankTransactionByIdQueryHandler(IBankTransactionRepository bankTransactionRepository, IBankRepository bankRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
        }

        public async Task<GetBankTransactionsListQueryResponse> Handle(GetBankTransactionByIdQuery request, CancellationToken cancellationToken)
        {
            var bank = await _bankRepository.GetByIdAsync(request.BankId);
            if (bank == null)
            {
                throw new OOH.Application.Exceptions.NotFoundException(nameof(OOH.Domain.Entities.Global.Bank), request.BankId);
            }

            var transactions = await _bankTransactionRepository.ListAllAsync();
            var banks = await _bankRepository.ListAllAsync();
            var requestedBank = banks.FirstOrDefault(b => b.BankId == request.BankId);
            
            // Filter by BankId
            var bankTransactions = transactions
                .Where(t => t.FromBankId == request.BankId || t.ToBankId == request.BankId)
                .OrderBy(x => x.CreatedDate)
                .ToList();
            
            var dtos = new List<BankTransactionListVM>();
            decimal runningBalance = 0;

            foreach (var t in bankTransactions)
            {
                bool isWithdrawal = t.FromBankId == request.BankId;
                bool isDeposit = t.ToBankId == request.BankId;

                decimal currentWithdrawal = isWithdrawal ? t.Amount : 0;
                decimal currentDeposit = isDeposit ? t.Amount : 0;

                runningBalance = runningBalance + currentDeposit - currentWithdrawal;

                dtos.Add(new BankTransactionListVM
                {
                    TransactionId = t.TransactionId,
                    BankId = request.BankId,
                    VendorId = t.VendorId,
                    BankName = requestedBank?.Name,
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

            // Reverse to show newest first if desired
            dtos.Reverse();

            return new GetBankTransactionsListQueryResponse
            {
                Success = true,
                Data = dtos
            };
        }
    }
}
