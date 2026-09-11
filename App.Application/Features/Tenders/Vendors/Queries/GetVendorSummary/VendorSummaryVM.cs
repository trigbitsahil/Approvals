namespace OOH.Application.Features.Tenders.Vendors.Queries.GetVendorSummary
{
    public class VendorSummaryVM
    {
        public string VendorId { get; set; }
        public decimal TotalPaidAmount { get; set; }
        public decimal PendingAmount { get; set; }
        public int TotalTransactionsCount { get; set; }
    }
}
