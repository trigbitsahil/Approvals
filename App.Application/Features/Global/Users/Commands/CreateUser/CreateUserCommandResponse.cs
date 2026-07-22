using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Users.Commands.CreateUser
{
    public class CreateUserCommandResponse : BaseResponse
    {
        public CreateUserCommandResponse() : base()
        {
        }

        public CreateUserDto Data { get; set; } = default!;
    }
}
