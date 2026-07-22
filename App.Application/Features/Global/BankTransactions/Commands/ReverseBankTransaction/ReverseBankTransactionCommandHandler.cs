using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.BankTransactions.Commands.ReverseBankTransaction
{
    public class ReverseBankTransactionCommandHandler : IRequestHandler<ReverseBankTransactionCommand, bool>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;

        public ReverseBankTransactionCommandHandler(IBankTransactionRepository bankTransactionRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;
        }

        public async Task<bool> Handle(ReverseBankTransactionCommand request, CancellationToken cancellationToken)
        {
            // Find the original transaction
            var allTransactions = await _bankTransactionRepository.ListAllAsync();
            var originalTxns = allTransactions.Where(t => t.ApprovalId == request.ApprovalId && !t.IsVoided && !t.IsReversed).ToList();

            if (!originalTxns.Any()) return false;

            foreach (var originalTxn in originalTxns)
            {
                var reverseTxn = new BankTransaction
                {
                    TransactionId = "Txn_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                    FromBankId = originalTxn.ToBankId, // Swap to and from
                    ToBankId = originalTxn.FromBankId,
                    ApprovalId = originalTxn.ApprovalId,
                    TransactionType = "Reversal",
                    Amount = originalTxn.Amount,
                    Withdrawal = originalTxn.Deposit,  // Deposit becomes Withdrawal
                    Deposit = originalTxn.Withdrawal,  // Withdrawal becomes Deposit
                    RunningBalance = 0, // 0 triggers dynamic calculation in query handler
                    IsVoided = false,
                    IsReversed = true,
                    CreatedBy = "System",
                    CreatedDate = DateTime.UtcNow,
                    TenantId = originalTxn.TenantId
                };

                await _bankTransactionRepository.AddAsync(reverseTxn);

                originalTxn.IsReversed = true;
                await _bankTransactionRepository.UpdateAsync(originalTxn);
            }

            return true;
        }
    }
}
