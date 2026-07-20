using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Transactions;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Transactions.Commands.CreateTransaction
{
    public class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, string>
    {
        private readonly IAsyncRepository<Transaction> _transactionRepository;
        private readonly IAsyncRepository<TransactionHistory> _transactionHistoryRepository;

        public CreateTransactionCommandHandler(
            IAsyncRepository<Transaction> transactionRepository,
            IAsyncRepository<TransactionHistory> transactionHistoryRepository)
        {
            _transactionRepository = transactionRepository;
            _transactionHistoryRepository = transactionHistoryRepository;
        }

        public async Task<string> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
        {
            var transaction = new Transaction
            {
                TransactionId = Guid.NewGuid().ToString(),
                Amount = request.Amount,
                SenderId = request.SenderId,
                ReceiverId = request.ReceiverId,
                TransactionTypeId = request.TransactionTypeId,
                Status = "Pending Approval",
                // Note: Description will be encrypted via DB functions in repository
                Description = request.Description
            };

            await _transactionRepository.AddAsync(transaction);

            var history = new TransactionHistory
            {
                HistoryId = Guid.NewGuid().ToString(),
                TransactionId = transaction.TransactionId,
                OldStatus = "None",
                NewStatus = "Pending Approval",
                Notes = "Transaction created"
            };

            await _transactionHistoryRepository.AddAsync(history);

            return transaction.TransactionId;
        }
    }
}
