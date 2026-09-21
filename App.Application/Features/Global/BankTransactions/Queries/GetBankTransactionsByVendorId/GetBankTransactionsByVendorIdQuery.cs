using MediatR;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByVendorId
{
    public class GetBankTransactionsByVendorIdQuery : IRequest<GetBankTransactionsByVendorIdQueryResponse>
    {
        public string VendorId { get; set; } = string.Empty;
    }
}
