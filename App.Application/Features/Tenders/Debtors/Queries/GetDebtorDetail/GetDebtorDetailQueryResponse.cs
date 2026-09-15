using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Debtors.Queries.GetDebtorDetail
{
    public class GetDebtorDetailQueryResponse : BaseResponse
    {
        public GetDebtorDetailQueryResponse() : base()
        {
        }

        public DebtorDetailVM Data { get; set; }
    }
}
