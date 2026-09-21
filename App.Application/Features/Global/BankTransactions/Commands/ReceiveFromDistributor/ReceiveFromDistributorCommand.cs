using MediatR;

namespace OOH.Application.Features.Global.BankTransactions.Commands.ReceiveFromDistributor
{
    public class ReceiveFromDistributorCommand : IRequest<ReceiveFromDistributorCommandResponse>
    {
        public string TransactionId { get; set; }
        public decimal? Amount { get; set; }
        public string? Remarks { get; set; }
    }
}
