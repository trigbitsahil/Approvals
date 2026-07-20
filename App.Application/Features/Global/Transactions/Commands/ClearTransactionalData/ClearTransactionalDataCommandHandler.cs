using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Transactions;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Transactions.Commands.ClearTransactionalData
{
    public class ClearTransactionalDataCommandHandler : IRequestHandler<ClearTransactionalDataCommand, bool>
    {
        private readonly IAsyncRepository<Transaction> _transactionRepository;
        private readonly IAsyncRepository<TransactionHistory> _transactionHistoryRepository;
        private readonly IAsyncRepository<TransactionLedger> _transactionLedgerRepository;

        public ClearTransactionalDataCommandHandler(
            IAsyncRepository<Transaction> transactionRepository,
            IAsyncRepository<TransactionHistory> transactionHistoryRepository,
            IAsyncRepository<TransactionLedger> transactionLedgerRepository)
        {
            _transactionRepository = transactionRepository;
            _transactionHistoryRepository = transactionHistoryRepository;
            _transactionLedgerRepository = transactionLedgerRepository;
        }

        public async Task<bool> Handle(ClearTransactionalDataCommand request, CancellationToken cancellationToken)
        {
            // Note: In a real implementation, you would typically execute a raw SQL command 
            // "TRUNCATE TABLE transaction_ledger, transaction_history, transaction CASCADE"
            // or loop through and delete. We simulate deletion here.
            // Strict authorization policies MUST be applied at the Controller level.

            var ledgers = await _transactionLedgerRepository.ListAllAsync();
            foreach (var l in ledgers) { await _transactionLedgerRepository.DeleteAsync(l); }

            var histories = await _transactionHistoryRepository.ListAllAsync();
            foreach (var h in histories) { await _transactionHistoryRepository.DeleteAsync(h); }

            var transactions = await _transactionRepository.ListAllAsync();
            foreach (var t in transactions) { await _transactionRepository.DeleteAsync(t); }

            return true;
        }
    }
}
