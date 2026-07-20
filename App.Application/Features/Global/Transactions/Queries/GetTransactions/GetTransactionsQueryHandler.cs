using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Transactions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Transactions.Queries.GetTransactions
{
    public class GetTransactionsQueryHandler : IRequestHandler<GetTransactionsQuery, List<TransactionDto>>
    {
        private readonly IAsyncRepository<Transaction> _transactionRepository;

        public GetTransactionsQueryHandler(IAsyncRepository<Transaction> transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<List<TransactionDto>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _transactionRepository.ListAllAsync();

            var dtos = transactions.Select(t => new TransactionDto
            {
                TransactionId = t.TransactionId,
                SenderId = t.SenderId,
                ReceiverId = t.ReceiverId,
                TransactionTypeId = t.TransactionTypeId,
                Status = t.Status,
                Description = t.Description,
                Amount = request.HasActualViewPermission ? t.Amount : MaskAmount(t.Amount),
                DisplayAmount = request.HasActualViewPermission ? t.Amount.ToString("N2") : MaskAmount(t.Amount).ToString("N2")
            }).ToList();

            return dtos;
        }

        private decimal MaskAmount(decimal originalAmount)
        {
            // If an amount is 2,000,000, hide or remove the last three zeros for display purposes
            if (originalAmount >= 1000)
            {
                return originalAmount / 1000m;
            }
            return originalAmount;
        }
    }
}
