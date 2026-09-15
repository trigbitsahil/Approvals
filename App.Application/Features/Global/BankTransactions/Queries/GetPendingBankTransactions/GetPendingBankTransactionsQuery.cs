using MediatR;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetPendingBankTransactions
{
    public class GetPendingBankTransactionsQuery : IRequest<GetPendingBankTransactionsQueryResponse>
    {
        public string? ApprovalType { get; set; }
    }
}
