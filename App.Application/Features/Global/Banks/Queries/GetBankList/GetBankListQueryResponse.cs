using System.Collections.Generic;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Banks.Queries.GetBankList
{
    public class GetBankListQueryResponse : BaseResponse
    {
        public GetBankListQueryResponse() : base()
        {
        }

        public List<BankListVM>? Data { get; set; }
    }
}
