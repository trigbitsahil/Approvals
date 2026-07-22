using System;

namespace OOH.Application.Features.Global.Users.Commands.CreateUser
{
    public class CreateUserDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsPhoneNumberPublic { get; set; }
        public string? ReportToUser { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
