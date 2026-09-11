using MediatR;

namespace OOH.Application.Features.Tenders.Debtors.Queries.GetDebtorDetail
{
    public class GetDebtorDetailQuery : IRequest<GetDebtorDetailQueryResponse>
    {
        public string DebtorID { get; set; }
    }
}
