using System.Collections.Generic;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDebtorId
{
    public class GetBankTransactionsByDebtorIdQueryResponse : BaseResponse
    {
        public GetBankTransactionsByDebtorIdQueryResponse() : base()
        {
        }

        public List<BankTransactionByDebtorIdVM>? Data { get; set; }
    }
}
