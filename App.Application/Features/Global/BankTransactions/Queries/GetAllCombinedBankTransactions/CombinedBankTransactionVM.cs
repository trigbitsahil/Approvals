namespace OOH.Application.Features.Global.BankTransactions.Queries.GetAllCombinedBankTransactions
{
    public class CombinedBankTransactionVM
    {
        public string ApprovalId { get; set; }
        public string ApprovalName { get; set; }
        public decimal Amount { get; set; }
        public string FromBankName { get; set; }
        public string ToBankName { get; set; }
        public string CompletedOn { get; set; }
        public decimal? RunningBalanceBank1 { get; set; } // Running balance for FromBank (Debit)
        public decimal? RunningBalanceBank2 { get; set; } // Running balance for ToBank (Credit)
    }
}
