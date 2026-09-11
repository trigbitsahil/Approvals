using MediatR;
using OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDebtorId
{
    public class GetBankTransactionsByDebtorIdQuery : IRequest<GetBankTransactionsListQueryResponse>
    {
        public string DebtorId { get; set; } = string.Empty;
        public string? Status { get; set; }
    }
}
