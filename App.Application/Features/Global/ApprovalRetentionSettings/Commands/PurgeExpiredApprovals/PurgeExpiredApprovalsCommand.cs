using MediatR;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.PurgeExpiredApprovals
{
    public class PurgeExpiredApprovalsCommand : IRequest<PurgeExpiredApprovalsCommandResponse>
    {
        public int? OverrideRetentionDays { get; set; }
        public string? TenantId { get; set; }
    }
}
