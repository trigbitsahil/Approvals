using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.UpdateApprovalComment
{
    public class UpdateApprovalCommentDto
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
