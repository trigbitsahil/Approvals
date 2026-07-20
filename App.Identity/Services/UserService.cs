using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OOH.Application.Contracts.Identity;
using OOH.Application.Features.Global.Users.Queries.GetUserList;
using OOH.Identity.Models;

namespace OOH.Identity.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<List<UserListVM>> GetUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            return users.Select(u => new UserListVM
            {
                UserID = u.Id,
                Id = u.Id,
                Email = u.Email,
                UserName = u.UserName,
                FirstName = u.FirstName,
                LastName = u.LastName,
                IsActive = u.IsActive,
                CreatedDate = u.CreatedDate.ToString("o"),
                ReportToUser = u.ReportToUser
            }).ToList();
        }

        public async Task<OOH.Application.Features.Global.Users.Queries.GetUserDetail.UserDetailVM> GetUserAsync(string id)
        {
            var u = await _userManager.FindByIdAsync(id);
            if (u == null) return null;

            return new OOH.Application.Features.Global.Users.Queries.GetUserDetail.UserDetailVM
            {
                UserID = u.Id,
                Id = u.Id,
                Email = u.Email,
                UserName = u.UserName,
                FirstName = u.FirstName,
                LastName = u.LastName,
                IsActive = u.IsActive,
                CreatedDate = u.CreatedDate.ToString("o"),
                ReportToUser = u.ReportToUser
            };
        }
    }
}
