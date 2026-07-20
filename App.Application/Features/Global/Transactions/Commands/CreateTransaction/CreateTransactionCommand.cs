using MediatR;
using System;

namespace OOH.Application.Features.Global.Transactions.Commands.CreateTransaction
{
    public class CreateTransactionCommand : IRequest<string>
    {
        public decimal Amount { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public string TransactionTypeId { get; set; }
        public string Description { get; set; } // Plaintext, handler will encrypt
    }
}
