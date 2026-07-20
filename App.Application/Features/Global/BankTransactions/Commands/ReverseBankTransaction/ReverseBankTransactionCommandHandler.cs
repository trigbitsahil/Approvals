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
            var originalTxn = allTransactions.FirstOrDefault(t => t.ApprovalId == request.ApprovalId && !t.IsVoided && !t.IsReversed);

            if (originalTxn == null) return false;

            // Option 1: Just mark it as voided
            // originalTxn.IsVoided = true;
            // await _bankTransactionRepository.UpdateAsync(originalTxn);

            // Option 2: Create a negative offsetting entry (as mentioned in UI)
            var reverseTxn = new BankTransaction
            {
                TransactionId = "Txn_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                FromBankId = originalTxn.ToBankId, // Swap to and from
                ToBankId = originalTxn.FromBankId,
                ApprovalId = originalTxn.ApprovalId,
                TransactionType = "Reversal",
                Amount = originalTxn.Amount,       // Keep amount positive because we swapped the banks
                Withdrawal = originalTxn.Amount,
                Deposit = originalTxn.Amount,
                RunningBalance = 0,
                IsVoided = false,
                IsReversed = true,
                CreatedBy = "System",
                CreatedDate = DateTime.UtcNow,
                TenantId = originalTxn.TenantId
            };

            await _bankTransactionRepository.AddAsync(reverseTxn);

            originalTxn.IsReversed = true;
            await _bankTransactionRepository.UpdateAsync(originalTxn);

            return true;
        }
    }
}
