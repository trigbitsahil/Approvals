using OOH.Application.Responses;
using System.Collections.Generic;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetPendingBankTransactions
{
    public class GetPendingBankTransactionsQueryResponse : BaseResponse
    {
        public GetPendingBankTransactionsQueryResponse() : base()
        {
        }

        public List<PendingBankTransactionVM> Data { get; set; }
    }
}
