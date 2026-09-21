using System.Collections.Generic;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalHistories.Queries.GetApprovalHistoryList
{
    public class GetApprovalHistoryListQueryResponse : BaseResponse
    {
        public GetApprovalHistoryListQueryResponse() : base()
        {
        }

        public List<ApprovalHistoryListVM>? Data { get; set; }
    }
}
