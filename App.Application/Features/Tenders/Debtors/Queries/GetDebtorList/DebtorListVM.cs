using System;

namespace OOH.Application.Features.Tenders.Debtors.Queries.GetDebtorList
{
    public class DebtorListVM
    {
        public string DebtorId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Website { get; set; }
        public string GstNumber { get; set; }
        public string PanNumber { get; set; }
        public string Address { get; set; }
        public string Note { get; set; }
        public bool IsVoided { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
