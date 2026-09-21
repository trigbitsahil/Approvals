namespace OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorSummary
{
    public class DistributorSummaryVM
    {
        public string DistributorId { get; set; }
        public decimal TotalReceivedAmount { get; set; }
        public decimal TotalPaidAmount { get; set; }
        public decimal RunningBalance { get; set; }
        public int TotalTransactionsCount { get; set; }
    }
}
