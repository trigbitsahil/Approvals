using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using OOH.Application.Contracts.Identity;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.Application.Features.Global.Users.Commands.CreateUser
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, CreateUserCommandResponse>
    {
        private readonly IUserService _userService;
        private readonly ILoggedInUserService _loggedInUser;

        public CreateUserCommandHandler(IUserService userService, ILoggedInUserService loggedInUser)
        {
            _userService = userService;
            _loggedInUser = loggedInUser;
        }

        public async Task<CreateUserCommandResponse> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var response = new CreateUserCommandResponse();

            try
            {
                var success = await _userService.CreateUserAsync(
                    request.Email,
                    request.Password,
                    request.FirstName,
                    request.LastName,
                    request.UserName,
                    request.PhoneNumber,
                    request.IsPhoneNumberPublic,
                    request.ReportToUser,
                    request.DepartmentId,
                    _loggedInUser.UserEmail ?? "System",
                    _loggedInUser.TenantId ?? ""
                );

                if (success)
                {
                    response.Success = true;
                    response.Message = "User created successfully";
                    response.Data = new CreateUserDto
                    {
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        Email = request.Email,
                        PhoneNumber = request.PhoneNumber,
                        IsPhoneNumberPublic = request.IsPhoneNumberPublic,
                        ReportToUser = request.ReportToUser,
                        CreatedBy = _loggedInUser.UserEmail ?? "System",
                        CreatedDate = DateTime.UtcNow
                    };
                }
                else
                {
                    response.Success = false;
                    response.Message = "Error creating the record";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }
    }
}
