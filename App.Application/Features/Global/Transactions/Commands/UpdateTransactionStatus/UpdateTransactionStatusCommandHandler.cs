using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Transactions;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Transactions.Commands.UpdateTransactionStatus
{
    public class UpdateTransactionStatusCommandHandler : IRequestHandler<UpdateTransactionStatusCommand, bool>
    {
        private readonly IAsyncRepository<Transaction> _transactionRepository;
        private readonly IAsyncRepository<TransactionHistory> _transactionHistoryRepository;
        private readonly IAsyncRepository<TransactionLedger> _transactionLedgerRepository;

        public UpdateTransactionStatusCommandHandler(
            IAsyncRepository<Transaction> transactionRepository,
            IAsyncRepository<TransactionHistory> transactionHistoryRepository,
            IAsyncRepository<TransactionLedger> transactionLedgerRepository)
        {
            _transactionRepository = transactionRepository;
            _transactionHistoryRepository = transactionHistoryRepository;
            _transactionLedgerRepository = transactionLedgerRepository;
        }

        public async Task<bool> Handle(UpdateTransactionStatusCommand request, CancellationToken cancellationToken)
        {
            var transaction = await _transactionRepository.GetByIdForUpdateAsync(request.TransactionId);

            if (transaction == null) return false;

            var oldStatus = transaction.Status;
            transaction.Status = request.NewStatus;

            // Simple Workflow Enforcement
            if (oldStatus == "Pending Approval" && request.NewStatus != "Approved" && request.NewStatus != "Rejected")
                throw new Exception("Invalid state transition from Pending Approval");

            await _transactionRepository.UpdateAsync(transaction);

            // Record History
            var history = new TransactionHistory
            {
                HistoryId = Guid.NewGuid().ToString(),
                TransactionId = transaction.TransactionId,
                OldStatus = oldStatus,
                NewStatus = request.NewStatus,
                Notes = request.Notes
            };

            await _transactionHistoryRepository.AddAsync(history);

            // If the transaction is 'Completed', create the double-entry ledger records
            if (request.NewStatus == "Completed")
            {
                var creditLedger = new TransactionLedger
                {
                    LedgerId = Guid.NewGuid().ToString(),
                    TransactionId = transaction.TransactionId,
                    AccountId = transaction.ReceiverId, // Receiver gets credit
                    EntryType = "Credit",
                    Amount = transaction.Amount
                };

                var debitLedger = new TransactionLedger
                {
                    LedgerId = Guid.NewGuid().ToString(),
                    TransactionId = transaction.TransactionId,
                    AccountId = transaction.SenderId, // Sender gets debit
                    EntryType = "Debit",
                    Amount = transaction.Amount
                };

                await _transactionLedgerRepository.AddAsync(creditLedger);
                await _transactionLedgerRepository.AddAsync(debitLedger);
            }

            return true;
        }
    }
}
