using MediatR;
using System.Collections.Generic;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList
{
    public class GetBankTransactionsListQueryResponse : BaseResponse
    {
        public GetBankTransactionsListQueryResponse() : base()
        {
        }

        public List<BankTransactionListVM>? Data { get; set; }
        public decimal RetentionTotalDeposit { get; set; }
        public decimal RetentionTotalWithdrawal { get; set; }
        public decimal RetentionRunningBalance { get; set; }
    }
}
