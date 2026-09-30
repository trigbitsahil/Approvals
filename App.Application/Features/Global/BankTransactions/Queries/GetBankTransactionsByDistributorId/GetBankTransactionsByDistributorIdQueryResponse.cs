using System.Collections.Generic;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDistributorId
{
    public class GetBankTransactionsByDistributorIdQueryResponse : BaseResponse
    {
        public GetBankTransactionsByDistributorIdQueryResponse() : base()
        {
        }

        public List<BankTransactionByDistributorIdVM>? Data { get; set; }
        public decimal RetentionTotalReceived { get; set; }
        public decimal RetentionTotalPaid { get; set; }
        public decimal RetentionRunningBalance { get; set; }
    }
}
