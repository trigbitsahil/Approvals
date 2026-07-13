namespace OOH.Application.Features.Global.ApprovalComments.Commands.CreateApprovalComment
{
    public class CreateApprovalCommentDto
    {

        public string ApprovalCommentId { get; set; }
        public string ApprovalId { get; set; }
        public string CommentText { get; set; }
        public bool IsVoided { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
       


    }
}
