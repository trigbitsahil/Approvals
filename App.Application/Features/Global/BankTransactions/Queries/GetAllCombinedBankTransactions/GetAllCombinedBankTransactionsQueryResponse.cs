using OOH.Application.Responses;
using System.Collections.Generic;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetAllCombinedBankTransactions
{
    public class GetAllCombinedBankTransactionsQueryResponse : BaseResponse
    {
        public GetAllCombinedBankTransactionsQueryResponse() : base()
        {
        }
        public List<CombinedBankTransactionVM> Data { get; set; }
    }
}
