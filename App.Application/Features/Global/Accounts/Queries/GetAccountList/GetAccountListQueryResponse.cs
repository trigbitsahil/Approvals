using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Accounts.Queries.GetAccountList
{
    public class GetAccountListQueryResponse : BaseResponse
    {

        public GetAccountListQueryResponse() : base()
        {

        }

        public List<AccountListVM> Data { get; set; } = default!;

    }
}