using System;

namespace OOH.Application.Features.Global.ApprovalHistories.Queries.GetApprovalHistoryList
{
    public class ApprovalHistoryListVM
    {
        public string HistoryId { get; set; }
        public string ApprovalId { get; set; }
        public string Action { get; set; }
        public string Description { get; set; }
        public string PerformedBy { get; set; }
        public string PerformedByName { get; set; }
        public string Remarks { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
