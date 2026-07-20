using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OOH.API.Models;
using OOH.Application.Contracts.Infrastructure;
using OOH.Domain.Entities.Global;
using OOH.Identity.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace OOH.API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/Account")]
    [ApiVersion(1)]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("fixed")]
    public class AccountController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;

        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        private readonly string tenantID;

        public AccountController(IConfiguration configuration, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager,IMediator mediator, ILoggedInUserService loggedInUser)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _userManager = userManager ?? throw new ArgumentNullException();
            _roleManager = roleManager ?? throw new ArgumentNullException();


            _mediator = mediator;
            _loggedInUser = loggedInUser;
 

        }
          

        [HttpPost("Register")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<AuthenticationResponse>> Register(ApplicationUser authenticationRequestBody)
        {
            try
            {

                // ------------------


                //IdentityRole role = new IdentityRole(roleName:"user2025");

                //  var dddddd =  await _roleManager.CreateAsync(role);    


                // ------------------


                //  var user = new ApplicationUser
                //  {
                //      UserName = authenticationRequestBody.UserName,
                //      Email = authenticationRequestBody.UserName,
                //      FirstName = "FN",
                //      LastName = "LN",
                //      TenantID = tenantID
                //  };


                //  string password = GenerateRandomPassword();
                //  var result1 = await _userManager.CreateAsync(user, password);


                ////  var user2 = await _userManager.GetUserAsync(User);


                // ------------------

                var user123 = await _userManager.FindByEmailAsync(authenticationRequestBody.UserName.ToString());


              

                 var abbbbb = await _userManager.AddToRoleAsync(user123, "user2025");

                // -----------------



                var dfsdfsdafsdfsdf = await  _userManager.GetRolesAsync(user123);

                return Ok( );
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public static string GenerateRandomPassword(PasswordOptions opts = null)
        {
            if (opts == null) opts = new PasswordOptions()
            {
                RequiredLength = 8,
                RequiredUniqueChars = 4,
                RequireDigit = true,
                RequireLowercase = true,
                RequireNonAlphanumeric = true,
                RequireUppercase = true
            };

            string[] randomChars = new[] {
            "ABCDEFGHJKLMNOPQRSTUVWXYZ",    // uppercase 
            "abcdefghijkmnopqrstuvwxyz",    // lowercase
            "0123456789",                   // digits
            "!@$?_-"                        // non-alphanumeric
        };

            Random rand = new Random(Environment.TickCount);
            List<char> chars = new List<char>();

            if (opts.RequireUppercase)
                chars.Insert(rand.Next(0, chars.Count),
                    randomChars[0][rand.Next(0, randomChars[0].Length)]);

            if (opts.RequireLowercase)
                chars.Insert(rand.Next(0, chars.Count),
                    randomChars[1][rand.Next(0, randomChars[1].Length)]);

            if (opts.RequireDigit)
                chars.Insert(rand.Next(0, chars.Count),
                    randomChars[2][rand.Next(0, randomChars[2].Length)]);

            if (opts.RequireNonAlphanumeric)
                chars.Insert(rand.Next(0, chars.Count),
                    randomChars[3][rand.Next(0, randomChars[3].Length)]);

            for (int i = chars.Count; i < opts.RequiredLength
                || chars.Distinct().Count() < opts.RequiredUniqueChars; i++)
            {
                string rcs = randomChars[rand.Next(0, randomChars.Length)];
                chars.Insert(rand.Next(0, chars.Count),
                    rcs[rand.Next(0, rcs.Length)]);
            }

            return new string(chars.ToArray());
        }











    }
}
