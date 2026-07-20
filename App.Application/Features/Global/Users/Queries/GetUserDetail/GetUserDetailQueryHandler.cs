using MediatR;
using System.Threading;
using System.Threading.Tasks;
using OOH.Application.Contracts.Identity;

namespace OOH.Application.Features.Global.Users.Queries.GetUserDetail
{
    public class GetUserDetailQueryHandler : IRequestHandler<GetUserDetailQuery, GetUserDetailQueryResponse>
    {
        private readonly IUserService _userService;

        public GetUserDetailQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<GetUserDetailQueryResponse> Handle(GetUserDetailQuery request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.Id))
            {
                return new GetUserDetailQueryResponse
                {
                    Success = false,
                    Message = "User Id is required"
                };
            }

            var user = await _userService.GetUserAsync(request.Id);
            
            if (user == null)
            {
                return new GetUserDetailQueryResponse
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            return new GetUserDetailQueryResponse
            {
                Success = true,
                Data = user
            };
        }
    }
}
