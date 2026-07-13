using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Contracts.Infrastructure
{
    public interface ILoggedInUserService
    {
        public string UserId { get; }

        public string UserEmail { get; }

        public string TenantId { get; }

    }

}
