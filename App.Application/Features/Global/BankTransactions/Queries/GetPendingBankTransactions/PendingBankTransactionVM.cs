using System;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetPendingBankTransactions
{
    public class PendingBankTransactionVM
    {
        public string TransactionId { get; set; }
        public string ApprovalId { get; set; }
        public string? ApprovalName { get; set; }
        public string? ApprovalReference { get; set; }
        public string? ApprovalType { get; set; }
        public string? TransactionType { get; set; }
        public string? FromBankId { get; set; }
        public string? FromBankName { get; set; }
        public string? AssignedBankUserId { get; set; }
        public string? ToBankId { get; set; }
        public string? ToBankName { get; set; }
        public string? VendorId { get; set; }
        public string? VendorName { get; set; }
        public string? DebtorId { get; set; }
        public string? DebtorName { get; set; }
        public string? DistributorId { get; set; }
        public string? DistributorName { get; set; }
        public decimal Amount { get; set; }
        public bool IsPaidToDistributor { get; set; }
        public bool IsConfirm { get; set; }
        public bool IsPartialAmount { get; set; }
        public string? Remarks { get; set; }
        public string CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public string DerivedStatus { get; set; }
    }
}
