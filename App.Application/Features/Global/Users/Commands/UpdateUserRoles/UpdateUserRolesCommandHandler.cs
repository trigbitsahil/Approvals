using MediatR;
using System.Threading;
using System.Threading.Tasks;
using OOH.Application.Contracts.Identity;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.Application.Features.Global.Users.Commands.UpdateUserRoles
{
    public class UpdateUserRolesCommandHandler : IRequestHandler<UpdateUserRolesCommand, UpdateUserRolesCommandResponse>
    {
        private readonly IUserService _userService;
        private readonly ILoggedInUserService _loggedInUserService;

        public UpdateUserRolesCommandHandler(IUserService userService, ILoggedInUserService loggedInUserService)
        {
            _userService = userService;
            _loggedInUserService = loggedInUserService;
        }

        public async Task<UpdateUserRolesCommandResponse> Handle(UpdateUserRolesCommand request, CancellationToken cancellationToken)
        {
            var response = new UpdateUserRolesCommandResponse();
            
            // 1. Determine if the logged-in user is a SuperAdmin
            var loggedInUserId = _loggedInUserService.UserId;
            var loggedInUserRoles = await _userService.GetUserRolesAsync(loggedInUserId);
            var isCurrentSuperAdmin = loggedInUserRoles.Contains("SuperAdmin") || _loggedInUserService.UserRole == "SuperAdmin";

            // 2. Determine if the target user is a SuperAdmin
            var targetUserRoles = await _userService.GetUserRolesAsync(request.UserId);
            var isTargetSuperAdmin = targetUserRoles.Contains("SuperAdmin");

            // 3. Determine if the user is trying to ASSIGN the SuperAdmin role
            var isAssigningSuperAdmin = request.Roles != null && request.Roles.Contains("SuperAdmin");

            if (!isCurrentSuperAdmin)
            {
                if (isTargetSuperAdmin)
                {
                    response.Success = false;
                    response.Message = "You do not have permission to modify a SuperAdmin's roles.";
                    return response;
                }

                if (isAssigningSuperAdmin)
                {
                    response.Success = false;
                    response.Message = "Only a SuperAdmin can assign the SuperAdmin role.";
                    return response;
                }
            }

            var success = await _userService.UpdateUserRolesAsync(request.UserId, request.Roles);

            if (success)
            {
                response.Success = true;
                response.Message = $"User roles updated successfully.";
            }
            else
            {
                response.Success = false;
                response.Message = "Failed to update user roles or user not found.";
            }

            return response;
        }
    }
}
