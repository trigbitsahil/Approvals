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
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly OOHIdentityDBContext _dbContext;

        public UserService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, OOHIdentityDBContext dbContext)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _dbContext = dbContext;
        }

        public async Task<List<UserListVM>> GetUsersAsync()
        {
            var users = await _userManager.Users.Where(u => !u.IsVoided).ToListAsync();
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
        public async Task<bool> CreateUserAsync(string email, string password, string firstName, string lastName, string userName, string phoneNumber, bool isPhoneNumberPublic, string? reportToUser, string? departmentId, string createdBy, string tenantId)
        {
            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                PhoneNumber = phoneNumber,
                IsPhoneNumberPublic = isPhoneNumberPublic,
                ReportToUser = reportToUser,
                DepartmentId = departmentId,
                CreatedBy = createdBy,
                TenantID = tenantId,
                IsActive = true,
                CreatedDate = System.DateTime.UtcNow
            };
            
            var result = await _userManager.CreateAsync(user, password);
            return result.Succeeded;
        }

        public async Task<bool> UpdateUserAsync(string id, string firstName, string lastName, string phoneNumber, bool isPhoneNumberPublic, string? reportToUser, string? departmentId, bool isActive, string lastModifiedBy)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return false;

            user.FirstName = firstName;
            user.LastName = lastName;
            user.PhoneNumber = phoneNumber;
            user.IsPhoneNumberPublic = isPhoneNumberPublic;
            user.ReportToUser = reportToUser;
            user.DepartmentId = departmentId;
            user.IsActive = isActive;
            user.LastModifiedBy = lastModifiedBy;
            user.LastModifiedDate = System.DateTime.UtcNow;
            
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                if (isActive)
                {
                    await _userManager.SetLockoutEnabledAsync(user, true);
                    await _userManager.SetLockoutEndDateAsync(user, System.DateTime.UtcNow.AddYears(-30));
                }
                else
                {
                    await _userManager.SetLockoutEnabledAsync(user, true);
                    await _userManager.SetLockoutEndDateAsync(user, System.DateTime.UtcNow.AddYears(30));
                }
            }
            return result.Succeeded;
        }

        public async Task<bool> DeleteUserAsync(string id, string lastModifiedBy)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return false;

            user.IsVoided = true;
            user.LastModifiedBy = lastModifiedBy;
            user.LastModifiedDate = System.DateTime.UtcNow;
            
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> UpdateUserRolesAsync(string userId, List<string> roles)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var assignedRoles = await _userManager.GetRolesAsync(user);
            var removeResult = await _userManager.RemoveFromRolesAsync(user, assignedRoles);
            if (!removeResult.Succeeded) return false;

            if (roles != null && roles.Any())
            {
                var addResult = await _userManager.AddToRolesAsync(user, roles);
                return addResult.Succeeded;
            }

            return true;
        }

        public async Task<List<string>> GetUserRolesAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return new List<string>();

            var roles = await _userManager.GetRolesAsync(user);
            return roles.ToList();
        }

        public async Task<List<string>> GetAllRolesAsync()
        {
            return await _roleManager.Roles.Select(r => r.Name!).ToListAsync();
        }

        public async Task<bool> CreateRoleAsync(string roleName)
        {
            var roleExists = await _roleManager.RoleExistsAsync(roleName);
            if (roleExists) return false;

            var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
            return result.Succeeded;
        }
        public async Task<bool> RegisterFCMTokenAsync(string userId, string token, string? deviceDetails = null)
        {
            Console.WriteLine($"[UserService.RegisterFCMTokenAsync] Registering token for userId: {userId}, token length: {token?.Length}");
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                Console.WriteLine($"[UserService.RegisterFCMTokenAsync] ERROR: User not found in database for userId: {userId}");
                return false;
            }

            // 1. Remove this exact token from any other users
            var otherUsersTokens = await _dbContext.UserFCMTokens
                .Where(t => t.Token == token && t.UserId != userId)
                .ToListAsync();
            
            if (otherUsersTokens.Any())
            {
                Console.WriteLine($"[UserService.RegisterFCMTokenAsync] Removing token from {otherUsersTokens.Count} other users.");
                _dbContext.UserFCMTokens.RemoveRange(otherUsersTokens);
            }

            // 2. Fetch all existing tokens for this user
            var userTokens = await _dbContext.UserFCMTokens
                .Where(t => t.UserId == userId)
                .ToListAsync();

            var matchingToken = userTokens.FirstOrDefault(t => t.Token == token);
            if (matchingToken == null)
            {
                // If device details match an existing token for this user, remove the old token for this device
                if (!string.IsNullOrEmpty(deviceDetails))
                {
                    var oldDeviceTokens = userTokens.Where(t => t.DeviceDetails == deviceDetails).ToList();
                    if (oldDeviceTokens.Any())
                    {
                        Console.WriteLine($"[UserService.RegisterFCMTokenAsync] Removing {oldDeviceTokens.Count} old tokens for device: {deviceDetails}");
                        _dbContext.UserFCMTokens.RemoveRange(oldDeviceTokens);
                    }
                }

                Console.WriteLine($"[UserService.RegisterFCMTokenAsync] Adding NEW token to database for userId: {userId} ({user.Email})");
                _dbContext.UserFCMTokens.Add(new UserFCMToken
                {
                    UserId = userId,
                    Token = token,
                    DeviceDetails = deviceDetails
                });
            }
            else
            {
                Console.WriteLine($"[UserService.RegisterFCMTokenAsync] Token already exists in database for userId: {userId} ({user.Email})");
            }

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteFCMTokenAsync(string userId, string token)
        {
            Console.WriteLine($"[UserService.DeleteFCMTokenAsync] Deleting token for userId: {userId}");
            var tokensToDelete = await _dbContext.UserFCMTokens
                .Where(t => t.UserId == userId && t.Token == token)
                .ToListAsync();

            if (tokensToDelete.Any())
            {
                _dbContext.UserFCMTokens.RemoveRange(tokensToDelete);
                await _dbContext.SaveChangesAsync();
                Console.WriteLine($"[UserService.DeleteFCMTokenAsync] Deleted {tokensToDelete.Count} token(s) for userId: {userId}");
            }
            else
            {
                Console.WriteLine($"[UserService.DeleteFCMTokenAsync] No matching token found to delete for userId: {userId}");
            }

            return true;
        }
    }
}
