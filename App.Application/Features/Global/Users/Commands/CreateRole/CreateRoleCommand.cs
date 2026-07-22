using MediatR;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Users.Commands.CreateRole
{
    public class CreateRoleCommandResponse : BaseResponse
    {
    }

    public class CreateRoleCommand : IRequest<CreateRoleCommandResponse>
    {
        public string RoleName { get; set; }
    }
}
