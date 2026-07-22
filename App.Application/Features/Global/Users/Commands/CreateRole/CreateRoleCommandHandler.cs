using MediatR;
using System.Threading;
using System.Threading.Tasks;
using OOH.Application.Contracts.Identity;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.Application.Features.Global.Users.Commands.CreateRole
{
    public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, CreateRoleCommandResponse>
    {
        private readonly IUserService _userService;
        private readonly ILoggedInUserService _loggedInUserService;

        public CreateRoleCommandHandler(IUserService userService, ILoggedInUserService loggedInUserService)
        {
            _userService = userService;
            _loggedInUserService = loggedInUserService;
        }

        public async Task<CreateRoleCommandResponse> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
        {
            var response = new CreateRoleCommandResponse();
            
            // Check if SuperAdmin
            var loggedInUserId = _loggedInUserService.UserId;
            var loggedInUserRoles = await _userService.GetUserRolesAsync(loggedInUserId);
            var isCurrentSuperAdmin = loggedInUserRoles.Contains("SuperAdmin") || _loggedInUserService.UserRole == "SuperAdmin";

            if (!isCurrentSuperAdmin)
            {
                response.Success = false;
                response.Message = "Only a SuperAdmin can create new roles.";
                return response;
            }

            if (string.IsNullOrWhiteSpace(request.RoleName))
            {
                response.Success = false;
                response.Message = "Role name cannot be empty.";
                return response;
            }

            var success = await _userService.CreateRoleAsync(request.RoleName);

            if (success)
            {
                response.Success = true;
                response.Message = $"Role '{request.RoleName}' created successfully.";
            }
            else
            {
                response.Success = false;
                response.Message = "Failed to create role or role already exists.";
            }

            return response;
        }
    }
}
