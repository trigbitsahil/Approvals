using MediatR;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDistributorId
{
    public class GetBankTransactionsByDistributorIdQuery : IRequest<GetBankTransactionsByDistributorIdQueryResponse>
    {
        public string DistributorId { get; set; } = string.Empty;
        public string? Status { get; set; }
    }
}
