using MediatR;
using System.Collections.Generic;

namespace OOH.Application.Features.Global.ApprovalHistories.Queries.GetApprovalHistoryList
{
    public class GetApprovalHistoryListQuery : IRequest<List<ApprovalHistoryListVM>>
    {
        public string ApprovalId { get; set; }

        public GetApprovalHistoryListQuery(string approvalId)
        {
            ApprovalId = approvalId;
        }
    }
}
