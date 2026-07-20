using MediatR;

namespace OOH.Application.Features.Global.BankTransactions.Commands.ReverseBankTransaction
{
    public class ReverseBankTransactionCommand : IRequest<bool>
    {
        public string ApprovalId { get; set; }
    }
}
