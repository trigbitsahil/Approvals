using MediatR;

namespace OOH.Application.Features.Global.BankTransactions.Commands.PayDistributor
{
    public class PayDistributorCommand : IRequest<PayDistributorCommandResponse>
    {
        public string TransactionId { get; set; }
    }
}
