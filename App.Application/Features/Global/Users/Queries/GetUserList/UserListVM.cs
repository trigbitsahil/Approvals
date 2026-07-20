using System;

namespace OOH.Application.Features.Global.Users.Queries.GetUserList
{
    public class UserListVM
    {
        public string? UserID { get; set; }
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool IsActive { get; set; }
        public string? CreatedDate { get; set; }
        public string? Id { get; set; }
        public string? ReportToUser { get; set; }
    }
}
