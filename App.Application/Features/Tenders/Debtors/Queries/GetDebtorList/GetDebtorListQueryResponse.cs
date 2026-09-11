using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Debtors.Queries.GetDebtorList
{
    public class GetDebtorListQueryResponse : BaseResponse
    {
        public GetDebtorListQueryResponse() : base()
        {
        }

        public List<DebtorListVM> Data { get; set; }
    }
}
