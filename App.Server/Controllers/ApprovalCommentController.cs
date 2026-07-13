
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Features.Global.ApprovalComments.Commands.CreateApprovalComment;
using OOH.Application.Features.Global.ApprovalComments.Commands.DeleteApprovalComment;
using OOH.Application.Features.Global.ApprovalComments.Commands.UpdateApprovalComment;
using OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentDetail;
using OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentList;

namespace OOH.API.Controllers
{

    [ApiController]
    [Route("api/v{version:apiVersion}/ApprovalComment")]
    [ApiVersion(1)]

    [Authorize]
    public class ApprovalCommentController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;

        public ApprovalCommentController(IMediator mediator, ILoggedInUserService loggedInUser)
        {
            _mediator = mediator;
            _loggedInUser = loggedInUser;
        }



        [HttpGet]

        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetApprovalCommentListQueryResponse>> GetApprovalCommentList(string approvalID)
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;
            //var xyz = _loggedInUser.TenantId;

            var getEntityListQuery = new GetApprovalCommentListQuery() { ApprovalId = approvalID };

            var dtos = await _mediator.Send(getEntityListQuery);

            //  var dtos = await _mediator.Send(new GetApprovalCommentListQuery() );

            return Ok(dtos);
        }




        [HttpGet("{id}", Name = "GetApprovalCommentByID")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<GetApprovalCommentDetailQueryResponse>> GetApprovalCommentByID(string id)
        {

            var getEntityDetailQuery = new GetApprovalCommentDetailQuery() { ApprovalCommentId = id };


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
        public async Task<ActionResult<CreateApprovalCommentCommandResponse>> PostApprovalComment([FromBody] CreateApprovalCommentCommand createEntityCommand)
        {
            var response = await _mediator.Send(createEntityCommand);

            if (response.Success)
            {

                return Ok(response);

            }
            {
                response.Message = "Error creating the record";
                return BadRequest(response);


            }

        }


        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UpdateApprovalCommentCommandResponse>> PutApprovalComment([FromBody] UpdateApprovalCommentCommand updateEntityCommand)
        {
            var response = await _mediator.Send(updateEntityCommand);

            if (response.Success)
            {

                return Ok(response);

            }
            {
                response.Message = "Error Updating the record";
                return BadRequest(response);
            }

        }


        [HttpDelete("{id}", Name = "DeleteApprovalComment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<DeleteApprovalCommentCommandResponse>> Delete(string id)
        {
            var deleteEntityCommand = new DeleteApprovalCommentCommand() { ApprovalCommentId = id };
            var response = await _mediator.Send(deleteEntityCommand);


            if (response.Success)
            {
                return Ok(response);
            }
            {
                return BadRequest(response);
            }
        }

    }
}
