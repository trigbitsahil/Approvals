using MediatR;

namespace OOH.Application.Features.Global.Accounts.Queries.GetAccountDetail
{
    public class GetAccountDetailQuery : IRequest<GetAccountDetailQueryResponse>
    {
        public string AccountID { get; set; }
    }
}
