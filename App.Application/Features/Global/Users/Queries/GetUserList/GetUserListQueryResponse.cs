using System.Collections.Generic;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Users.Queries.GetUserList
{
    public class GetUserListQueryResponse : BaseResponse
    {
        public GetUserListQueryResponse() : base()
        {
        }

        public List<UserListVM>? Data { get; set; }
    }
}
