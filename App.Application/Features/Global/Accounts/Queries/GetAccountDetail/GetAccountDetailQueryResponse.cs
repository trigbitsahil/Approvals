using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Accounts.Queries.GetAccountDetail
{
    public class GetAccountDetailQueryResponse : BaseResponse
    {

        public GetAccountDetailQueryResponse() : base()
        {

        }

        public AccountDetailVM Data { get; set; } = default!;

    }
}
