using MediatR;
using System.Collections.Generic;

namespace OOH.Application.Features.Global.Transactions.Queries.GetTransactions
{
    public class GetTransactionsQuery : IRequest<List<TransactionDto>>
    {
        public bool HasActualViewPermission { get; set; }
    }

    public class TransactionDto
    {
        public string TransactionId { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public string TransactionTypeId { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        
        // Amount logic
        public decimal Amount { get; set; }
        public string DisplayAmount { get; set; }
    }
}
