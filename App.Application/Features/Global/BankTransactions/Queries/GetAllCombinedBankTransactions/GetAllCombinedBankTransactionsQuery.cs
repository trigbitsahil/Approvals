using MediatR;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetAllCombinedBankTransactions
{
    public class GetAllCombinedBankTransactionsQuery : IRequest<GetAllCombinedBankTransactionsQueryResponse>
    {
        public string? ApprovalType { get; set; }
    }
}
