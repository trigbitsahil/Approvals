using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using OOH.Application.Contracts.Identity;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.Application.Features.Global.Users.Commands.RegisterFCMToken
{
    public class RegisterFCMTokenCommandHandler : IRequestHandler<RegisterFCMTokenCommand, bool>
    {
        private readonly IUserService _userService;
        private readonly ILoggedInUserService _loggedInUser;

        public RegisterFCMTokenCommandHandler(IUserService userService, ILoggedInUserService loggedInUser)
        {
            _userService = userService;
            _loggedInUser = loggedInUser;
        }

        public async Task<bool> Handle(RegisterFCMTokenCommand request, CancellationToken cancellationToken)
        {
            try
            {
                Console.WriteLine($"[RegisterFCMTokenCommandHandler] Registering FCM token. LoggedInUserId: '{_loggedInUser.UserId}', Email: '{_loggedInUser.UserEmail}'");
                if (string.IsNullOrEmpty(_loggedInUser.UserId))
                {
                    Console.WriteLine("[RegisterFCMTokenCommandHandler] ERROR: LoggedInUserId is null or empty!");
                    return false;
                }
                
                var result = await _userService.RegisterFCMTokenAsync(_loggedInUser.UserId, request.Token, request.DeviceDetails);
                Console.WriteLine($"[RegisterFCMTokenCommandHandler] RegisterFCMTokenAsync returned: {result}");
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RegisterFCMTokenCommandHandler] Exception: {ex.Message}\n{ex.StackTrace}");
                return false;
            }
        }
    }
}
