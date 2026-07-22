using MediatR;

namespace OOH.Application.Features.Global.Users.Commands.UpdateUser
{
    public class UpdateUserCommand : IRequest<UpdateUserCommandResponse>
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsPhoneNumberPublic { get; set; }
        public string? ReportToUser { get; set; }
        public string? DepartmentId { get; set; }
        public bool IsActive { get; set; }
    }
}
