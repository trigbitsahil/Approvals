using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using OOH.Application.Contracts.Identity;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.Application.Features.Global.Users.Commands.DeleteUser
{
    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, DeleteUserCommandResponse>
    {
        private readonly IUserService _userService;
        private readonly ILoggedInUserService _loggedInUser;

        public DeleteUserCommandHandler(IUserService userService, ILoggedInUserService loggedInUser)
        {
            _userService = userService;
            _loggedInUser = loggedInUser;
        }

        public async Task<DeleteUserCommandResponse> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var response = new DeleteUserCommandResponse();

            try
            {
                var success = await _userService.DeleteUserAsync(request.UserID, _loggedInUser.UserEmail ?? "System");

                if (success)
                {
                    response.Success = true;
                    response.Message = "User deleted successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Error deleting user or User Not Found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }
    }
}
