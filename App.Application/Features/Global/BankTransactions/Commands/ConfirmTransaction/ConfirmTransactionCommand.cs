using MediatR;

namespace OOH.Application.Features.Global.BankTransactions.Commands.ConfirmTransaction
{
    public class ConfirmTransactionCommand : IRequest<ConfirmTransactionCommandResponse>
    {
        public string TransactionId { get; set; }
        public string Remarks { get; set; }
    }
}
