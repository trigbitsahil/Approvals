using System.Collections.Generic;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByVendorId
{
    public class GetBankTransactionsByVendorIdQueryResponse : BaseResponse
    {
        public GetBankTransactionsByVendorIdQueryResponse() : base()
        {
        }

        public List<BankTransactionByVendorIdVM>? Data { get; set; }
    }
}
