using MediatR;
using System.Threading;
using System.Threading.Tasks;
using OOH.Application.Contracts.Identity;

namespace OOH.Application.Features.Global.Users.Queries.GetAllRoles
{
    public class GetAllRolesQueryHandler : IRequestHandler<GetAllRolesQuery, GetAllRolesCommandResponse>
    {
        private readonly IUserService _userService;

        public GetAllRolesQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<GetAllRolesCommandResponse> Handle(GetAllRolesQuery request, CancellationToken cancellationToken)
        {
            var response = new GetAllRolesCommandResponse();
            
            var roles = await _userService.GetAllRolesAsync();

            response.Success = true;
            response.Data = roles;

            return response;
        }
    }
}
