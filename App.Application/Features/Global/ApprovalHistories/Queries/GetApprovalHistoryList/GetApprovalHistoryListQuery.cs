using MediatR;
using System.Collections.Generic;

namespace OOH.Application.Features.Global.ApprovalHistories.Queries.GetApprovalHistoryList
{
    public class GetApprovalHistoryListQuery : IRequest<GetApprovalHistoryListQueryResponse>
    {
        public string ApprovalId { get; set; }

        public GetApprovalHistoryListQuery(string approvalId)
        {
            ApprovalId = approvalId;
        }
    }
}
