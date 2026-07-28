
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Features.Global.Users.Queries.GetUserList;
using OOH.Application.Features.Global.Users.Queries.GetUserDetail;
using OOH.Application.Features.Global.Users.Commands.CreateUser;
using OOH.Application.Features.Global.Users.Commands.UpdateUser;
using OOH.Application.Features.Global.Users.Commands.DeleteUser;
using OOH.Application.Features.Global.Users.Commands.UpdateUserRoles;
using OOH.Application.Features.Global.Users.Commands.CreateRole;
using OOH.Application.Features.Global.Users.Queries.GetUserRoles;
using OOH.Application.Features.Global.Users.Queries.GetAllRoles;
using OOH.Application.Features.Global.Users.Commands.RegisterFCMToken;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/User")]
    [ApiVersion("1")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;

        public UserController(IMediator mediator, ILoggedInUserService loggedInUser)
        {
            _mediator = mediator;
            _loggedInUser = loggedInUser;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GetUserListQueryResponse>> GetUserList()
        {
            var dtos = await _mediator.Send(new GetUserListQuery());
            return Ok(dtos);
        }

        [HttpPost("FCMToken")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> RegisterFCMToken([FromBody] RegisterFCMTokenRequest request)
        {
            Console.WriteLine($"[UserController] POST /FCMToken received. User authenticated: {User.Identity?.IsAuthenticated}, User Name: {User.Identity?.Name}");
            var success = await _mediator.Send(new RegisterFCMTokenCommand { Token = request.Token, DeviceDetails = request.DeviceDetails });
            if (success)
                return Ok();
            Console.WriteLine("[UserController] POST /FCMToken returned BadRequest (success = false)");
            return BadRequest();
        }

        [HttpGet("GetLoggedInUser", Name = "GetLoggedInUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetUserDetailQueryResponse>> GetLoggedInUser()
        {
            var getEntityDetailQuery = new GetUserDetailQuery() { Id = _loggedInUser.UserId };

            var dtos = await _mediator.Send(getEntityDetailQuery);

            if (dtos.Data != null)
            {
                return Ok(dtos);
            }
            else
            {
                return NotFound(dtos);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CreateUserCommandResponse>> PostUser([FromBody] CreateUserCommand createEntityCommand)
        {
            var response = await _mediator.Send(createEntityCommand);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UpdateUserCommandResponse>> PutUser([FromBody] UpdateUserCommand updateEntityCommand)
        {
            var response = await _mediator.Send(updateEntityCommand);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpDelete("{id}", Name = "DeleteUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<DeleteUserCommandResponse>> Delete(string id)
        {
            var deleteEntityCommand = new DeleteUserCommand() { UserID = id };
            var response = await _mediator.Send(deleteEntityCommand);

            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpPost("AddUserToRoles", Name = "AddUserToRoles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UpdateUserRolesCommandResponse>> AddUserToRoles([FromBody] UpdateUserRolesCommand command)
        {
            var response = await _mediator.Send(command);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpGet("GetUserRoles", Name = "GetUserRoles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetUserRolesCommandResponse>> GetUserRoles(string id)
        {
            var response = await _mediator.Send(new GetUserRolesQuery { UserId = id });
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }

        [HttpGet("GetAllRoles", Name = "GetAllRoles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetAllRolesCommandResponse>> GetAllRoles()
        {
            var response = await _mediator.Send(new GetAllRolesQuery());
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }

        [HttpPost("CreateRole", Name = "CreateRole")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CreateRoleCommandResponse>> CreateRole([FromBody] CreateRoleCommand command)
        {
            var response = await _mediator.Send(command);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
    }
}
//        [HttpGet("{id}", Name = "GetUserByID")]

//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]

//        public async Task<ActionResult<GetUserDetailQueryResponse>> GetUserByID(string id)
//        {

//            var getEntityDetailQuery = new GetUserDetailQuery() { Id = id };

//            //   ApplicationUser user = await _userManager.FindByIdAsync(id);

//            var dtos = await _mediator.Send(getEntityDetailQuery);

//            //  dtos.Data = new UserDetailVM();

//            //  var mapping =  _mapper.Map(user, dtos.Data, typeof(ApplicationUser), typeof(UserDetailVM));


//            // dtos.Data = _mapper.Map<UserDetailVM>(user);

//            if (dtos.Data != null)
//            {

//                return Ok(dtos);


//            }
//            else
//            {
//                return NotFound(dtos);

//            }


//        }





//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        public async Task<ActionResult<CreateUserCommandResponse>> PostUser([FromBody] CreateUserCommand createEntityCommand)
//        {
//            try
//            {


//                var user = new ApplicationUser();

//                user.UserName = createEntityCommand.Email;
//                user.Email = createEntityCommand.Email;
//                user.FirstName = createEntityCommand.FirstName;
//                user.LastName = createEntityCommand.LastName;
//                user.PhoneNumber = createEntityCommand.PhoneNumber;
//                user.IsPhoneNumberPublic = createEntityCommand.IsPhoneNumberPublic;
//                user.ReportToUser = createEntityCommand.ReportToUser;

//                user.DepartmentId = createEntityCommand.DepartmentId;

//                user.CreatedBy = _loggedInUser.UserEmail;
//                user.CreatedDate = DateTime.UtcNow;
//                user.IsActive = true;

//                user.TenantID = _loggedInUser.TenantId;



//                //  string password = GenerateRandomPassword();


//                var result1 = await _userManager.CreateAsync(user, createEntityCommand.Password);

//                var response = new CreateUserCommandResponse();


//                if (result1.Succeeded)
//                {
//                    var createdUser = await _userManager.FindByEmailAsync(createEntityCommand.Email.ToString());

//                    //  await _mediator.Send(createEntityCommand);
//                    response.Data = new CreateUserDto()
//                    {
//                        Id = createdUser.Id,
//                        FirstName = createdUser.FirstName,
//                        Email = createdUser.Email,

//                        LastName = createdUser.LastName,
//                        PhoneNumber = createdUser.PhoneNumber,
//                        //IsPhoneNumberPublic = createdUser.IsPhoneNumberPublic,
//                        //ReportToUser = createdUser.ReportToUser,
//                        //CreatedBy = createdUser.CreatedBy,
//                        //CreatedDate = createdUser.CreatedDate.ToString(),

//                    };
//                    return Ok(response);

//                }
//                {
//                    response.Success = false;
//                    response.Message = "Error creating the record";
//                    return BadRequest(response);


//                }


//            }
//            catch (Exception ex)
//            {
//                throw ex;

//            }

//        }


//        [HttpPut]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        public async Task<ActionResult<UpdateUserCommandResponse>> PutUser([FromBody] UpdateUserCommand updateEntityCommand)
//        {



//            //var user = new ApplicationUser();
//            var response = new UpdateUserCommandResponse();



//            ApplicationUser user = await _userManager.FindByIdAsync(updateEntityCommand.Id);

//            if (user == null)
//            {
//                response.Success = false;
//                response.Message = "User Not Found";
//                return BadRequest(response);
//            }

//            user.FirstName = updateEntityCommand.FirstName;
//            user.LastName = updateEntityCommand.LastName;
//            user.PhoneNumber = updateEntityCommand.PhoneNumber;
//            user.IsPhoneNumberPublic = updateEntityCommand.IsPhoneNumberPublic;
//            user.ReportToUser = updateEntityCommand.ReportToUser;
//            user.LastModifiedBy = _loggedInUser.UserEmail;
//            user.LastModifiedDate = DateTime.UtcNow;
//            user.IsActive = updateEntityCommand.IsActive;
//            user.DepartmentId = updateEntityCommand.DepartmentId;

//            var result = await _userManager.UpdateAsync(user);


//            ///   var response = await _mediator.Send(updateEntityCommand);

//            if (result.Succeeded)
//            {

//                if (user.IsActive)
//                {
//                    result = await _userManager.SetLockoutEnabledAsync(user, true);
//                    result = await _userManager.SetLockoutEndDateAsync(user, DateTime.UtcNow.AddYears(-30));
//                }
//                else
//                {

//                    result = await _userManager.SetLockoutEnabledAsync(user, true);
//                    result = await _userManager.SetLockoutEndDateAsync(user, DateTime.UtcNow.AddYears(30));
//                }

//                if (result.Succeeded)
//                {
//                    response.Data = new UpdateUserDto()
//                    {
//                        Id = user.Id,
//                        FirstName = user.LastName,
//                        Email = user.Email,

//                        LastName = user.LastName,
//                        PhoneNumber = user.PhoneNumber,
//                        IsPhoneNumberPublic = user.IsPhoneNumberPublic,
//                        ReportToUser = user.ReportToUser,
//                        UserName = user.UserName,
//                        IsActive = user.IsActive
//                        //IsPhoneNumberPublic = createdUser.IsPhoneNumberPublic,
//                        //ReportToUser = createdUser.ReportToUser,
//                        //CreatedBy = createdUser.CreatedBy,
//                        //CreatedDate = createdUser.CreatedDate.ToString(),

//                    };


//                    return Ok(response);


//                }


//            }
           

//                response.Success = false;
//                response.Message = "Error Updating the record";
//                return BadRequest(response);
          

//        }


//        [HttpDelete("{id}", Name = "DeleteUser")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesDefaultResponseType]
//        public async Task<ActionResult<DeleteUserCommandResponse>> Delete(string id)
//        {
//            var deleteEntityCommand = new DeleteUserCommand() { UserID = id };

//            ApplicationUser user = await _userManager.FindByIdAsync(id);

//            var response = new DeleteUserCommandResponse();



//            if (user == null)
//            {
//                response.Success = false;
//                response.Message = "User Not Found";
//                return BadRequest(response);
//            }


//            user.IsVoided = true;
//            user.LastModifiedBy = _loggedInUser.UserEmail;
//            user.LastModifiedDate = DateTime.UtcNow;

//            var result = await _userManager.UpdateAsync(user);

//            ////    var response = await _mediator.Send(deleteEntityCommand);
//            //var result = await _userManager.SetLockoutEnabledAsync(user, true);
//            //var result2 =  await _userManager.SetLockoutEndDateAsync(user,DateTime.UtcNow.AddYears(-110));


//            if (result.Succeeded)
//            {

//                if (response.Success)
//                {
//                    return Ok(response);
//                }
//                {
//                    return BadRequest(response);
//                }
//            }
//            {

//                response.Success = false;
//                response.Message = "Error Updating the record";
//                return BadRequest(response);
//            }

//        }






//        [HttpPost("SetActiveInactive", Name = "SetActiveInactive")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]


//        public async Task<ActionResult<UpdateUserCommandResponse>> SetActiveInactive(string id)
//        {

//            ApplicationUser user = await _userManager.FindByIdAsync(id);

//            var response = new UpdateUserCommandResponse();

//            if (user == null)
//            {
//                response.Success = false;
//                response.Message = "User Not Found";
//                return BadRequest(response);
//            }


//            user.IsActive = !user.IsActive;
//            user.LastModifiedBy = _loggedInUser.UserEmail;
//            user.LastModifiedDate = DateTime.UtcNow;
//            var result = await _userManager.UpdateAsync(user);

//            if (result.Succeeded)
//            {

//                if (user.IsActive)
//                {
//                    result = await _userManager.SetLockoutEnabledAsync(user, true);
//                    result = await _userManager.SetLockoutEndDateAsync(user, DateTime.UtcNow.AddYears(-30));
//                }
//                else
//                {

//                    result = await _userManager.SetLockoutEnabledAsync(user, true);
//                    result = await _userManager.SetLockoutEndDateAsync(user, DateTime.UtcNow.AddYears(30));
//                }



//            }


//            if (result.Succeeded)
//            {

//                if (response.Success)
//                {

//                    response.Data = new UpdateUserDto()
//                    {
//                        Id = user.Id,
//                        FirstName = user.LastName,
//                        Email = user.Email,

//                        LastName = user.LastName,
//                        PhoneNumber = user.PhoneNumber,
//                        IsPhoneNumberPublic = user.IsPhoneNumberPublic,
//                        ReportToUser = user.ReportToUser,
//                        UserName = user.UserName,
//                        IsActive = user.IsActive
//                        //IsPhoneNumberPublic = createdUser.IsPhoneNumberPublic,
//                        //ReportToUser = createdUser.ReportToUser,
//                        //CreatedBy = createdUser.CreatedBy,
//                        //CreatedDate = createdUser.CreatedDate.ToString(),

//                    };
//                    return Ok(response);
//                }
//                {
//                    return BadRequest(response);
//                }
//            }
//            {

//                response.Success = false;
//                response.Message = "Error Updating the record";
//                return BadRequest(response);
//            }

//        }

//        [AllowAnonymous]
//        [HttpPost("ForgotPassword", Name = "ForgotPassword")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]


//        public async Task<ActionResult<DeleteUserCommandResponse>> ForgotPassword(ForgotPasswordCommand request)
//        {

//            ApplicationUser user = await _userManager.FindByEmailAsync(request.Email);

//            var response = new DeleteUserCommandResponse();

//            if (user == null)
//            {
//                response.Success = false;
//                response.Message = "User Not Found";
//                return BadRequest(response);
//            }


//            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

//            bool isSent = false;

//            if (!string.IsNullOrEmpty(token))
//            {
//                var param = new Dictionary<string, string>
//                  {

//                   { "token", token } ,
//                   { "email", request.Email }

//                  };

//                var callback = QueryHelpers.AddQueryString(request.ClientUrl, param);

//                EmailInfo objEmailInfo = new EmailInfo(callback, request.Email, "", "Reset Password Token", "dev@wallop.in", null);

//                isSent = await _emailService.SendEmail(objEmailInfo);


//            }


//            if (isSent)
//            {

//                if (response.Success)
//                {


//                    return Ok(response);
//                }
//                {
//                    return BadRequest(response);
//                }
//            }
//            else 
//            {

//                response.Success = false;
//                response.Message = "Error Updating the record";
//                return BadRequest(response);
//            }

//        }



//        [AllowAnonymous]
//        [HttpPost("ResetPassword", Name = "ResetPassword")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]


//        public async Task<ActionResult<DeleteUserCommandResponse>> ResetPassword(ResetPasswordCommand request)
//        {

//            ApplicationUser user = await _userManager.FindByEmailAsync(request.Email);

//            var response = new DeleteUserCommandResponse();

//            if (user == null)
//            {
//                response.Success = false;
//                response.Message = "User Not Found";
//                return BadRequest(response);
//            }


//            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.Password);




//            if (result.Succeeded)
//            {



//                return Ok(response);


//            }
//            else
//            {
               
//                response.Success = false;

//                if (result.Errors != null && result.Errors.Count() > 0)
//                {
//                    response.Message = result.Errors.FirstOrDefault().Description;
//                }
//                else
//                {
                     
//                    response.Message = "Error Updating the record";
//                }
           
//                return BadRequest(response);
//            }

//        }





//        [HttpPost("ChangePassword", Name = "ChangePassword")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]


//        public async Task<ActionResult<DeleteUserCommandResponse>> ChangePassword(ChangePasswordCommand request)
//        {

//            ApplicationUser user = await _userManager.FindByIdAsync(_loggedInUser.UserId);

//            var response = new DeleteUserCommandResponse();

//            if (user == null)
//            {
//                response.Success = false;
//                response.Message = "User Not Found";
//                return BadRequest(response);
//            }


//            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);




//            if (result.Succeeded)
//            {



//                return Ok(response);


//            }
//            else
//            {

//                response.Success = false;
//                if (result.Errors != null && result.Errors.Count() > 0)
//                {
//                    response.Message = result.Errors.FirstOrDefault().Description;
//                }
//                else
//                {

//                    response.Message = "Error Updating the record";
//                }
                
//                return BadRequest(response);
//            }

//        }

//        [HttpPost("ChangeUserPassword", Name = "ChangeUserPassword")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]


//        public async Task<ActionResult<DeleteUserCommandResponse>> ChangeUserPassword(ChangeUserPasswordCommand request)
//        {

//            ApplicationUser user = await _userManager.FindByIdAsync(request.UserId);

//            var response = new DeleteUserCommandResponse();

//            if (user == null)
//            {
//                response.Success = false;
//                response.Message = "User Not Found";
//                return BadRequest(response);
//            }

//            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
//            // var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
//            var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);




//            if (result.Succeeded)
//            {



//                return Ok(response);


//            }
//            {

//                response.Success = false;
//                if (result.Errors != null && result.Errors.Count() > 0)
//                {
//                    response.Message = result.Errors.FirstOrDefault().Description;
//                }
//                else
//                {

//                    response.Message = "Error Updating the record";
//                }
             
//                return BadRequest(response);
//            }

//        }




//        [HttpPost("AddUserToRoles", Name = "AddUserToRoles")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]

//        public async Task<ActionResult<DeleteUserCommandResponse>> AddUserToRoles([FromBody] UserRolesDto model)

//        {

//            var response = new DeleteUserCommandResponse();

//            var user = await _userManager.FindByIdAsync(model.UserId);
//            if (user == null)
//            {

//                response.Success = false;
//                response.Message = "User not found";
//                return NotFound(response);
//            }

//            //// Validate roles asynchronously
//            //var validRoles = (await Task.WhenAll(model.Roles.Select(async role =>
//            //    (Role: role, Exists: await _roleManager.RoleExistsAsync(role)))))
//            //    .Where(result => result.Exists)
//            //    .Select(result => result.Role)
//            //    .ToList();

//            //if (!validRoles.Any())
//            //{

//            //    response.Success = false;
//            //    response.Message = "No valid roles provided.";
//            //    return BadRequest(response);
//            //}


//            //delete the existing list of roles and assign new roles 
//            var assignedRoles = await _userManager.GetRolesAsync(user);
//            var result1 = await _userManager.RemoveFromRolesAsync(user, assignedRoles);



//            //var userRoles = await _userManager.GetRolesAsync(user);
//            //var selectedRoles = model.Roles.Select(r => r).ToList();

//            //// Remove unselected roles
//            //await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

//            //// Add new selected roles
//            //await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));


//            var result = await _userManager.AddToRolesAsync(user, model.Roles);

//            if (result.Succeeded)
//            {
//                response.Success = true;
//                response.Message = $"User {user.UserName} added to roles: {string.Join(", ", model.Roles)}";
//                return Ok(response);

//            }
//            else
//            {

//                response.Success = false;
//                response.Message = "No valid roles provided.";
//                return BadRequest(response);

//            }
//            //   return BadRequest(result.Errors);
//        }

//        /// <summary>
//        /// Remove a user from multiple roles.
//        /// </summary>
//        [HttpPost("RemoveUserFromRoles", Name = "RemoveUserFromRoles")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]


//        public async Task<ActionResult<DeleteUserCommandResponse>> RemoveUserFromRoles([FromBody] UserRolesDto model)
//        {
//            var response = new DeleteUserCommandResponse();

//            var user = await _userManager.FindByIdAsync(model.UserId);
//            if (user == null)
//            {

//                response.Success = false;
//                response.Message = "User not found";
//                return NotFound(response);
//            }

//            var assignedRoles = await _userManager.GetRolesAsync(user);
//            var rolesToRemove = model.Roles.Intersect(assignedRoles).ToList();

//            if (!rolesToRemove.Any())
//            {


//                response.Success = false;
//                response.Message = "User is not assigned to the specified roles.";
//                return BadRequest(response);
//            }


//            var result = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
//            if (result.Succeeded)
//            {

//                response.Success = true;
//                response.Message = $"User {user.UserName} removed from roles: {string.Join(", ", rolesToRemove)}";
//                return Ok(response);

//            }
//            else
//            {

//                response.Success = false;
//                response.Message = "Error";
//                return BadRequest(response);

//            }

//        }

//        /// <summary>
//        /// Get all roles assigned to a user.
//        /// </summary>
//        /// 

    
//        [HttpGet("GetUserRoles", Name = "GetUserRoles")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]
 

//        public async Task<ActionResult<GetUserRolesCommandResponse>> GetUserRoles(string id)
//        {
//            var response = new GetUserRolesCommandResponse();

//            var user = await _userManager.FindByIdAsync(id);
//            if (user == null)
//            {

//                response.Success = false;
//                response.Message = "User not found";
//                return NotFound(response);
//            }
//            response.Data = await _userManager.GetRolesAsync(user);
//            response.Success = true;
//            return Ok(response);



//        }




//        [HttpGet("GetMyRoles", Name = "GetMyRoles")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]

//        public async Task<ActionResult<GetUserRolesCommandResponse>> GetMyRoles()
//        {
//            var response = new GetUserRolesCommandResponse();

//            var user = await _userManager.FindByIdAsync(_loggedInUser.UserId);


//            if (user == null)
//            {

//                response.Success = false;
//                response.Message = "User not found";
//                return NotFound(response);
//            }
//            response.Data = await _userManager.GetRolesAsync(user);
//            response.Success = true;
//            return Ok(response);
         



//        }




//        /// <summary>
//        /// Check if a user is assigned to specific roles.
//        /// </summary>
//        [HttpGet("IsUserInRoles", Name = "IsUserInRoles")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]

//        public async Task<ActionResult<DeleteUserCommandResponse>> IsUserInRoles([FromBody] UserRolesDto model)
//        {

//            var response = new DeleteUserCommandResponse();

//            var user = await _userManager.FindByIdAsync(model.UserId);
//            if (user == null)
//            {

//                response.Success = false;
//                response.Message = "User not found";
//                return NotFound(response);
//            }
//            var assignedRoles = await _userManager.GetRolesAsync(user);
//            var matchedRoles = model.Roles.Intersect(assignedRoles).ToList();

//            return Ok(new { UserId = model.UserId, RolesChecked = model.Roles, AssignedRoles = matchedRoles });
//        }




//        [HttpPost("CreateRole", Name = "CreateRole")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]
//        public async Task<ActionResult<DeleteUserCommandResponse>> CreateRole([FromBody] CreateRoleCommand model)
//        {


//            var response = new DeleteUserCommandResponse();

//            if (string.IsNullOrWhiteSpace(model.RoleName))
//            {

//                response.Success = false;
//                response.Message = "Role name cannot be empty.";
//                return BadRequest(response);

//            }


//            var roleExists = await _roleManager.RoleExistsAsync(model.RoleName);
//            if (roleExists)
//            {

//                response.Success = false;
//                response.Message = "Role already exists.";
//                return BadRequest(response);

//            }


//            var result = await _roleManager.CreateAsync(new IdentityRole(model.RoleName));
//            if (result.Succeeded)

//            {

//                response.Success = true;
//                response.Message = $"Role '{model.RoleName}' created successfully.";
//                return Ok(response);

//            }

//            return BadRequest(result.Errors);
//        }



//      //  [Authorize(Roles = "SuperAdmin")]

//        [HttpGet("GetAllRoles", Name = "GetAllRoles")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]
//        public async Task<ActionResult<GetUserRolesCommandResponse>> GetAllRoles()
//        {


//            var response = new GetUserRolesCommandResponse();

//            var roles = _roleManager.Roles.Select(r => r.Name).ToList();



//            if (!roles.Any())

//            {
//                response.Success = false;
//                response.Message = "User not found";
//                return NotFound(response);

//            }


//            response.Data = roles.ToList();

//            response.Success = true;
//            return Ok(response);


 




//        }




//        [HttpGet("GetUserActivity", Name = "GetUserActivity")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]


//        public async Task<ActionResult<GetUserActivityQueryResponse>> GetUserActivity(string id)
//        {
//            var getEntityDetailQuery = new GetUserActivityQuery() { Id = id };

//            //   ApplicationUser user = await _userManager.FindByIdAsync(id);

//            var dtos = await _mediator.Send(getEntityDetailQuery);

//            //  dtos.Data = new UserDetailVM();

//            //  var mapping =  _mapper.Map(user, dtos.Data, typeof(ApplicationUser), typeof(UserDetailVM));


//            // dtos.Data = _mapper.Map<UserDetailVM>(user);

//            if (dtos.Data != null)
//            {

//                return Ok(dtos);


//            }
//            else
//            {
//                return NotFound(dtos);

//            }

//        }


//        public static string GenerateRandomPassword(PasswordOptions opts = null)
//        {
//            if (opts == null) opts = new PasswordOptions()
//            {
//                RequiredLength = 8,
//                RequiredUniqueChars = 4,
//                RequireDigit = true,
//                RequireLowercase = true,
//                RequireNonAlphanumeric = true,
//                RequireUppercase = true
//            };

//            string[] randomChars = new[] {
//            "ABCDEFGHJKLMNOPQRSTUVWXYZ",    // uppercase 
//            "abcdefghijkmnopqrstuvwxyz",    // lowercase
//            "0123456789",                   // digits
//            "!@$?_-"                        // non-alphanumeric
//        };

//            Random rand = new Random(Environment.TickCount);
//            List<char> chars = new List<char>();

//            if (opts.RequireUppercase)
//                chars.Insert(rand.Next(0, chars.Count),
//                    randomChars[0][rand.Next(0, randomChars[0].Length)]);

//            if (opts.RequireLowercase)
//                chars.Insert(rand.Next(0, chars.Count),
//                    randomChars[1][rand.Next(0, randomChars[1].Length)]);

//            if (opts.RequireDigit)
//                chars.Insert(rand.Next(0, chars.Count),
//                    randomChars[2][rand.Next(0, randomChars[2].Length)]);

//            if (opts.RequireNonAlphanumeric)
//                chars.Insert(rand.Next(0, chars.Count),
//                    randomChars[3][rand.Next(0, randomChars[3].Length)]);

//            for (int i = chars.Count; i < opts.RequiredLength
//                || chars.Distinct().Count() < opts.RequiredUniqueChars; i++)
//            {
//                string rcs = randomChars[rand.Next(0, randomChars.Length)];
//                chars.Insert(rand.Next(0, chars.Count),
//                    rcs[rand.Next(0, rcs.Length)]);
//            }

//            return new string(chars.ToArray());
//        }

//    }
//}
