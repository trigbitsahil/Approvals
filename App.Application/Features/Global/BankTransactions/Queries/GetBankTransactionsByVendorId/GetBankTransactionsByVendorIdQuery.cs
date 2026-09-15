using MediatR;
using OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByVendorId
{
    public class GetBankTransactionsByVendorIdQuery : IRequest<GetBankTransactionsListQueryResponse>
    {
        public string VendorId { get; set; } = string.Empty;
    }
}
