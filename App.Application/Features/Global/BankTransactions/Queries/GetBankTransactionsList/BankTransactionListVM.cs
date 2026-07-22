using System;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList
{
    public class BankTransactionListVM
    {
        public string? TransactionId { get; set; }
        public string? BankId { get; set; }
        public string? VendorId { get; set; }
        public string? BankName { get; set; }
        public string? ApprovalId { get; set; }
        public string? ApprovalName { get; set; }
        public string? TransactionType { get; set; }
        public decimal Amount { get; set; }
        public decimal Deposit { get; set; }
        public decimal Withdrawal { get; set; }
        public decimal RunningBalance { get; set; }
        public string? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
    }
}
