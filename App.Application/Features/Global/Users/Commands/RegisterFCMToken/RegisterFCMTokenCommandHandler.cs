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
                if (string.IsNullOrEmpty(_loggedInUser.UserId)) return false;
                
                return await _userService.RegisterFCMTokenAsync(_loggedInUser.UserId, request.Token, request.DeviceDetails);
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
