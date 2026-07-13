using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using OOH.Identity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Identity
{
    public class UserClaimsPrincipalFactory(UserManager<ApplicationUser> userManager
        , RoleManager<IdentityRole> roleManager
        , IOptions<IdentityOptions> options)
        : UserClaimsPrincipalFactory<ApplicationUser, IdentityRole>(userManager, roleManager, options)
    {
        public override async Task<ClaimsPrincipal> CreateAsync(ApplicationUser user)
        {
            var id = await GenerateClaimsAsync(user);

            if (user.TenantID != null)
            {
                id.AddClaim(new Claim("tenant", user.TenantID));
            }
            if (user.FirstName != null)
            {
                id.AddClaim(new Claim("firstname", user.TenantID));
            }
            if (user.LastName != null)
            {
                id.AddClaim(new Claim("lastname", user.TenantID));
            }

            return new ClaimsPrincipal(id);
        }

    }
}
