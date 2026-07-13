using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Identity.Models
{
    public class ApplicationUser : IdentityUser
    {

        public string? FirstName { get; set; }

        public string? LastName { get; set; }
        
        public string? ReportToUser { get; set; }

        public string? DepartmentId { get; set; }

        public bool IsPhoneNumberPublic { get; set; }

        public bool IsVoided { get; set; }

        public bool IsActive { get; set; }

        public string CreatedBy { get; set; }
 
        public DateTime CreatedDate { get; set; }
 
        public string? LastModifiedBy { get; set; }
     
        public DateTime? LastModifiedDate { get; set; }

        public string? TenantID { get; set; }
    }
}
