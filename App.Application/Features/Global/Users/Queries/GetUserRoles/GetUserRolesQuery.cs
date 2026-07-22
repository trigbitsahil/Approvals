using MediatR;
using System.Collections.Generic;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Users.Queries.GetUserRoles
{
    public class GetUserRolesCommandResponse : BaseResponse
    {
        public List<string> Data { get; set; } = new List<string>();
    }

    public class GetUserRolesQuery : IRequest<GetUserRolesCommandResponse>
    {
        public string UserId { get; set; }
    }
}
