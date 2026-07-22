using MediatR;

namespace OOH.Application.Features.Global.Users.Commands.DeleteUser
{
    public class DeleteUserCommand : IRequest<DeleteUserCommandResponse>
    {
        public string UserID { get; set; }
    }
}
