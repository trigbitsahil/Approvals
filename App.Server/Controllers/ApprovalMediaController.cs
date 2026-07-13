
//using Asp.Versioning;
//using MediatR;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using OOH.Application.Contracts.Infrastructure;
//using OOH.Application.Features.Global.ApprovalMedias.Commands.CreateApprovalMedia;
//using OOH.Application.Features.Global.ApprovalMedias.Commands.DeleteApprovalMedia;
//using OOH.Application.Features.Global.ApprovalMedias.Commands.UpdateApprovalMedia;
//using OOH.Application.Features.Global.ApprovalMedias.Queries.GetApprovalMediaDetail;
//using OOH.Application.Features.Global.ApprovalMedias.Queries.GetApprovalMediaList;

//namespace OOH.API.Controllers
//{

//    [ApiController]
//    [Route("api/v{version:apiVersion}/ApprovalMedia")]
//    [ApiVersion(1)]

//    [Authorize]
//    public class ApprovalMediaController : ControllerBase
//    {
//        private readonly IMediator _mediator;
//        private readonly ILoggedInUserService _loggedInUser;

//        public ApprovalMediaController(IMediator mediator, ILoggedInUserService loggedInUser)
//        {
//            _mediator = mediator;
//            _loggedInUser = loggedInUser;
//        }



//        [HttpGet]

//        [ProducesResponseType(StatusCodes.Status200OK)]

//        public async Task<ActionResult<GetApprovalMediaListQueryResponse>> GetApprovalMediaList( )
//        {
//            //var abd = _loggedInUser.UserId;
//            //var def = _loggedInUser.UserEmail;

//            //var xyz = _loggedInUser.TenantId;

//            //var getEntityListQuery = new GetApprovalMediaListQuery() { CategoryID = categoryId, Category = category };

//            //var dtos = await _mediator.Send(getEntityListQuery);

//            var dtos = await _mediator.Send(new GetApprovalMediaListQuery() );

//            return Ok(dtos);
//        }




//        [HttpGet("{id}", Name = "GetApprovalMediaByID")]

//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]

//        public async Task<ActionResult<GetApprovalMediaDetailQueryResponse>> GetApprovalMediaByID(string id)
//        {

//            var getEntityDetailQuery = new GetApprovalMediaDetailQuery() { ApprovalMediaId = id };


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
//        public async Task<ActionResult<CreateApprovalMediaCommandResponse>> PostApprovalMedia([FromBody] CreateApprovalMediaCommand createEntityCommand)
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
//        public async Task<ActionResult<UpdateApprovalMediaCommandResponse>> PutApprovalMedia([FromBody] UpdateApprovalMediaCommand updateEntityCommand)
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


//        [HttpDelete("{id}", Name = "DeleteApprovalMedia")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesDefaultResponseType]
//        public async Task<ActionResult<DeleteApprovalMediaCommandResponse>> Delete(string id)
//        {
//            var deleteEntityCommand = new DeleteApprovalMediaCommand() { ApprovalMediaId = id };
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
