using MediatR;
using System.Threading;
using System.Threading.Tasks;
using OOH.Application.Contracts.Identity;

namespace OOH.Application.Features.Global.Users.Queries.GetUserRoles
{
    public class GetUserRolesQueryHandler : IRequestHandler<GetUserRolesQuery, GetUserRolesCommandResponse>
    {
        private readonly IUserService _userService;

        public GetUserRolesQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<GetUserRolesCommandResponse> Handle(GetUserRolesQuery request, CancellationToken cancellationToken)
        {
            var response = new GetUserRolesCommandResponse();
            
            var roles = await _userService.GetUserRolesAsync(request.UserId);

            response.Success = true;
            response.Data = roles;

            return response;
        }
    }
}
