using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Users.Commands.UpdateUser
{
    public class UpdateUserCommandResponse : BaseResponse
    {
        public UpdateUserCommandResponse() : base()
        {
        }

        public UpdateUserDto Data { get; set; } = default!;
    }
}
