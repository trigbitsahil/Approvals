using MediatR;

namespace OOH.Application.Features.Global.Users.Commands.RegisterFCMToken
{
    public class RegisterFCMTokenCommand : IRequest<bool>
    {
        public string Token { get; set; }
        public string? DeviceDetails { get; set; }
    }
}
