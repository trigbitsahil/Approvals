using System;

namespace OOH.Application.Features.Global.Banks.Queries.GetBankList
{
    public class BankListVM
    {
        public string BankId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string? UserId { get; set; }
        public string Status { get; set; }
        public bool IsActive { get; set; }
        public decimal RunningBalance { get; set; }
    }
}
