using System;

namespace OOH.Application.Features.Global.Users.Commands.UpdateUser
{
    public class UpdateUserDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsPhoneNumberPublic { get; set; }
        public string? ReportToUser { get; set; }
        public bool IsActive { get; set; }
    }
}
