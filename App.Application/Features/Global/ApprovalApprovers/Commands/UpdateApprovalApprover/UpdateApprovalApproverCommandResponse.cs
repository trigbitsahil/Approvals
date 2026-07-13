using OOH.Application.Responses;
using OOH.Domain.Entities.Global;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.UpdateApprovalApprover
{
    public class UpdateApprovalApproverCommandResponse : BaseResponse
    {

        public UpdateApprovalApproverCommandResponse() : base()
        {

        }

        public UpdateApprovalApproverDto Data { get; set; } = default!;

        public bool IsLetterCreated { get; set; } = false;
       // public string LetterContent { get; set; } = string.Empty;
      //  public string LetterId { get; set; } = string.Empty;
        //public Letter Letter { get; set; } = new Letter();

        //public LetterDraft LetterDraft { get; set; } = new LetterDraft();

        //public string LetterSignatureImageUrl { get; set; } = string.Empty ;


        public Approval Approval { get; set; } = new Approval();

        ////public OfficeNote OfficeNote { get; set; } = new OfficeNote();

        public ExpenseTransaction ExpenseTransaction { get; set; } = new ExpenseTransaction();




    }
}
