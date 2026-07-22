using MediatR;
using System.Collections.Generic;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Users.Commands.UpdateUserRoles
{
    public class UpdateUserRolesCommandResponse : BaseResponse
    {
    }

    public class UpdateUserRolesCommand : IRequest<UpdateUserRolesCommandResponse>
    {
        public string UserId { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
    }
}
