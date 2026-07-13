using MediatR;

namespace OOH.Application.Features.Global.Accounts.Queries.GetAccountList
{
    public class GetAccountListQuery : IRequest<GetAccountListQueryResponse>
    {
        public string Category { get; set; }

        public string CategoryID { get; set; }

    }
}
