using System;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByVendorId
{
    public class BankTransactionByVendorIdVM
    {
        public string? TransactionId { get; set; }
        public string? BankId { get; set; }
        public string? VendorId { get; set; }
        public string? DebtorId { get; set; }
        public string? DistributorId { get; set; }
        public string? DistributorName { get; set; }
        public string? FromBankId { get; set; }
        public string? ToBankId { get; set; }
        public string? FromBankUserEmail { get; set; }
        public string? PaidToDistributorBy { get; set; }
        public string? PaidToDistributorDate { get; set; }
        public bool IsPaidToDistributor { get; set; }
        public bool IsConfirm { get; set; }
        public bool IsPartialAmount { get; set; }
        public string? BankName { get; set; }
        public string? FromBankName { get; set; }
        public string? ToBankName { get; set; }
        public string? VendorName { get; set; }
        public string? ApprovalId { get; set; }
        public string? ApprovalName { get; set; }
        public string? ApprovalReference { get; set; }
        public string? TransactionType { get; set; }
        public decimal Amount { get; set; }
        public decimal Deposit { get; set; }
        public decimal Withdrawal { get; set; }
        public decimal RunningBalance { get; set; }
        public string? Remarks { get; set; }
        public string? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public string? LastModifiedDate { get; set; }
        public string? LastModifiedBy { get; set; }
    }
}
