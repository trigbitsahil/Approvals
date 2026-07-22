using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using OOH.Application.Contracts.Identity;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.Application.Features.Global.Users.Commands.UpdateUser
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UpdateUserCommandResponse>
    {
        private readonly IUserService _userService;
        private readonly ILoggedInUserService _loggedInUser;

        public UpdateUserCommandHandler(IUserService userService, ILoggedInUserService loggedInUser)
        {
            _userService = userService;
            _loggedInUser = loggedInUser;
        }

        public async Task<UpdateUserCommandResponse> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var response = new UpdateUserCommandResponse();

            try
            {
                var success = await _userService.UpdateUserAsync(
                    request.Id,
                    request.FirstName,
                    request.LastName,
                    request.PhoneNumber,
                    request.IsPhoneNumberPublic,
                    request.ReportToUser,
                    request.DepartmentId,
                    request.IsActive,
                    _loggedInUser.UserEmail ?? "System"
                );

                if (success)
                {
                    response.Success = true;
                    response.Message = "User updated successfully";
                    response.Data = new UpdateUserDto
                    {
                        Id = request.Id,
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        PhoneNumber = request.PhoneNumber,
                        IsPhoneNumberPublic = request.IsPhoneNumberPublic,
                        ReportToUser = request.ReportToUser,
                        IsActive = request.IsActive
                    };
                }
                else
                {
                    response.Success = false;
                    response.Message = "Error updating the user or User Not Found";
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
