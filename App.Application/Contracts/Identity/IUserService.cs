using System.Collections.Generic;
using System.Threading.Tasks;
using OOH.Application.Features.Global.Users.Queries.GetUserList;

namespace OOH.Application.Contracts.Identity
{
    public interface IUserService
    {
        Task<List<UserListVM>> GetUsersAsync();
        Task<OOH.Application.Features.Global.Users.Queries.GetUserDetail.UserDetailVM> GetUserAsync(string id);
        Task<bool> CreateUserAsync(string email, string password, string firstName, string lastName, string userName, string phoneNumber, bool isPhoneNumberPublic, string? reportToUser, string? departmentId, string createdBy, string tenantId);
        Task<bool> UpdateUserAsync(string id, string firstName, string lastName, string phoneNumber, bool isPhoneNumberPublic, string? reportToUser, string? departmentId, bool isActive, string lastModifiedBy);
        Task<bool> DeleteUserAsync(string id, string lastModifiedBy);
        
        // Roles
        Task<bool> UpdateUserRolesAsync(string userId, List<string> roles);
        Task<List<string>> GetUserRolesAsync(string userId);
        Task<List<string>> GetAllRolesAsync();
        Task<bool> CreateRoleAsync(string roleName);
    }
}
