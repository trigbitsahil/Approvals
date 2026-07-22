using MediatR;

namespace OOH.Application.Features.Global.Users.Commands.CreateUser
{
    public class CreateUserCommand : IRequest<CreateUserCommandResponse>
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsPhoneNumberPublic { get; set; }
        public string? ReportToUser { get; set; }
        public string? DepartmentId { get; set; }
    }
}
