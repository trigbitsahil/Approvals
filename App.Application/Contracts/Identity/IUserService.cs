using System.Collections.Generic;
using System.Threading.Tasks;
using OOH.Application.Features.Global.Users.Queries.GetUserList;

namespace OOH.Application.Contracts.Identity
{
    public interface IUserService
    {
        Task<List<UserListVM>> GetUsersAsync();
        Task<OOH.Application.Features.Global.Users.Queries.GetUserDetail.UserDetailVM> GetUserAsync(string id);
    }
}
