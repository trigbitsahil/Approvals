using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Users.Queries.GetUserDetail
{
    public class GetUserDetailQueryResponse : BaseResponse
    {
        public GetUserDetailQueryResponse() : base()
        {
        }

        public UserDetailVM? Data { get; set; }
    }
}
