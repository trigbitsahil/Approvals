using MediatR;
using OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDistributorId
{
    public class GetBankTransactionsByDistributorIdQuery : IRequest<GetBankTransactionsListQueryResponse>
    {
        public string DistributorId { get; set; } = string.Empty;
        public string? Status { get; set; }
    }
}
