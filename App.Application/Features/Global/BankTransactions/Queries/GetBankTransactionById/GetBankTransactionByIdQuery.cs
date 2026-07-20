using MediatR;
using OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionById
{
    public class GetBankTransactionByIdQuery : IRequest<GetBankTransactionsListQueryResponse>
    {
        public string BankId { get; set; }
    }
}
