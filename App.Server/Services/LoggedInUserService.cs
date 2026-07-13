using OOH.Application.Contracts.Infrastructure;
using System.Security.Claims;

namespace OOH.API.Services
{
    public class LoggedInUserService : ILoggedInUserService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        public LoggedInUserService(IHttpContextAccessor httpContextAccessor)
        {
            _contextAccessor = httpContextAccessor;
        }

        public string UserId
        {
            get
            {
                //var kkk = _contextAccessor.HttpContext?.User?.Identity.Name;
                

                //var sss =  _contextAccessor.HttpContext?.User?.Identity.
 
                return _contextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            }
        }

        public string UserEmail
        {
            get
            {
                //var kkk = _contextAccessor.HttpContext?.User?.Identity.Name;


                //var sss =  _contextAccessor.HttpContext?.User?.Identity.

                return _contextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);
            }
        }

        public string TenantId
        {
            get
            {
          

                //var sss =  _contextAccessor.HttpContext?.User?.Identity.

                return _contextAccessor.HttpContext?.User?.FindFirstValue("tenant");
            }
        }
    }
}
