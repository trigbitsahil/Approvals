using System;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.PurgeExpiredApprovals
{
    public class PurgeResultVM
    {
        public int DeletedApprovalsCount { get; set; }
        public int DeletedBankTransactionsCount { get; set; }
        public int RetentionDaysUsed { get; set; }
        public DateTime CutoffDateUtc { get; set; }
        public DateTime ExecutedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
