using MediatR;
using System;

namespace OOH.Application.Features.Global.Transactions.Commands.UpdateTransactionStatus
{
    public class UpdateTransactionStatusCommand : IRequest<bool>, OOH.Application.Contracts.Infrastructure.ITransactionalCommand
    {
        public string TransactionId { get; set; }
        public string NewStatus { get; set; }
        public string Notes { get; set; }
    }
}
