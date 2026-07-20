using MediatR;
using System.Threading;
using System.Threading.Tasks;
using OOH.Application.Contracts.Identity;

namespace OOH.Application.Features.Global.Users.Queries.GetUserList
{
    public class GetUserListQueryHandler : IRequestHandler<GetUserListQuery, GetUserListQueryResponse>
    {
        private readonly IUserService _userService;

        public GetUserListQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<GetUserListQueryResponse> Handle(GetUserListQuery request, CancellationToken cancellationToken)
        {
            var users = await _userService.GetUsersAsync();
            
            return new GetUserListQueryResponse
            {
                Success = true,
                Data = users
            };
        }
    }
}
