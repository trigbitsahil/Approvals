using MediatR;
using System.Collections.Generic;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Users.Queries.GetAllRoles
{
    public class GetAllRolesCommandResponse : BaseResponse
    {
        public List<string> Data { get; set; } = new List<string>();
    }

    public class GetAllRolesQuery : IRequest<GetAllRolesCommandResponse>
    {
    }
}
