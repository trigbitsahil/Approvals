
//using Asp.Versioning;
//using MediatR;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using OOH.Application.Contracts.Infrastructure;
//using OOH.Application.Features.Global.UserIntermediates.Commands.CreateUserIntermediate;
//using OOH.Application.Features.Global.UserIntermediates.Commands.DeleteUserIntermediate;
//using OOH.Application.Features.Global.UserIntermediates.Commands.UpdateUserIntermediate;
//using OOH.Application.Features.Global.UserIntermediates.Queries.GetUserIntermediateDetail;
//using OOH.Application.Features.Global.UserIntermediates.Queries.GetUserIntermediateList;

//namespace OOH.API.Controllers
//{

//    [ApiController]
//    [Route("api/v{version:apiVersion}/UserIntermediate")]
//    [ApiVersion(1)]

//    [Authorize]
//    public class UserIntermediateController : ControllerBase
//    {
//        private readonly IMediator _mediator;
//        private readonly ILoggedInUserService _loggedInUser;

//        public UserIntermediateController(IMediator mediator, ILoggedInUserService loggedInUser)
//        {
//            _mediator = mediator;
//            _loggedInUser = loggedInUser;
//        }



//        [HttpGet]

//        [ProducesResponseType(StatusCodes.Status200OK)]

//        public async Task<ActionResult<GetUserIntermediateListQueryResponse>> GetUserIntermediateList(string category,string categoryId)
//        {
//            //var abd = _loggedInUser.UserId;
//            //var def = _loggedInUser.UserEmail;

//            //var xyz = _loggedInUser.TenantId;

//            var getEntityListQuery = new GetUserIntermediateListQuery() { CategoryID = categoryId, Category = category };

//            var dtos = await _mediator.Send(getEntityListQuery);

//           // var dtos = await _mediator.Send(new GetUserIntermediateListQuery() );

//            return Ok(dtos);
//        }




//        [HttpGet("{id}", Name = "GetUserIntermediateByID")]

//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]

//        public async Task<ActionResult<GetUserIntermediateDetailQueryResponse>> GetUserIntermediateByID(string id)
//        {

//            var getEntityDetailQuery = new GetUserIntermediateDetailQuery() { UserIntermediateId = id };


//            var dtos = await _mediator.Send(getEntityDetailQuery);

//            if (dtos.Data != null)
//            {

//                return Ok(dtos);


//            }
//            else
//            {
//                return NotFound(dtos);

//            }


//        }


//        [HttpPost]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        public async Task<ActionResult<CreateUserIntermediateCommandResponse>> PostUserIntermediate([FromBody] CreateUserIntermediateCommand createEntityCommand)
//        {
//            var response = await _mediator.Send(createEntityCommand);

//            if (response.Success)
//            {

//                return Ok(response);

//            }
//            {
//                response.Message = "Error creating the record";
//                return BadRequest(response);


//            }

//        }


//        [HttpPut]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        public async Task<ActionResult<UpdateUserIntermediateCommandResponse>> PutUserIntermediate([FromBody] UpdateUserIntermediateCommand updateEntityCommand)
//        {
//            var response = await _mediator.Send(updateEntityCommand);

//            if (response.Success)
//            {

//                return Ok(response);

//            }
//            {
//                response.Message = "Error Updating the record";
//                return BadRequest(response);
//            }

//        }


//        [HttpDelete("{id}", Name = "DeleteUserIntermediate")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesDefaultResponseType]
//        public async Task<ActionResult<DeleteUserIntermediateCommandResponse>> Delete(string id)
//        {
//            var deleteEntityCommand = new DeleteUserIntermediateCommand() { UserIntermediateId = id };
//            var response = await _mediator.Send(deleteEntityCommand);


//            if (response.Success)
//            {
//                return Ok(response);
//            }
//            {
//                return BadRequest(response);
//            }
//        }

//    }
//}
