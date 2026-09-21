using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.PurgeExpiredApprovals
{
    public class PurgeExpiredApprovalsCommandResponse : BaseResponse
    {
        public PurgeExpiredApprovalsCommandResponse() : base()
        {
        }

        public PurgeResultVM? Data { get; set; }
    }
}
