namespace OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentDetail
{
    public class ApprovalCommentDetailVM
    {
        public string ApprovalCommentId { get; set; }
        public string ApprovalId { get; set; }
        public string CommentText { get; set; }
        public bool IsVoided { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }


    }
}
