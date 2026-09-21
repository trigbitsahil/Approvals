using MediatR;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDebtorId
{
    public class GetBankTransactionsByDebtorIdQuery : IRequest<GetBankTransactionsByDebtorIdQueryResponse>
    {
        public string DebtorId { get; set; } = string.Empty;
        public string? Status { get; set; }
    }
}
