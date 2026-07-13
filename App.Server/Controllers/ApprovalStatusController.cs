
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Features.Global.ApprovalStatuss.Commands.CreateApprovalStatus;
using OOH.Application.Features.Global.ApprovalStatuss.Commands.DeleteApprovalStatus;
using OOH.Application.Features.Global.ApprovalStatuss.Commands.UpdateApprovalStatus;
using OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusDetail;
using OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusList;

namespace OOH.API.Controllers
{

    [ApiController]
    [Route("api/v{version:apiVersion}/ApprovalStatus")]
    [ApiVersion(1)]

    [Authorize]
    public class ApprovalStatusController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;

        public ApprovalStatusController(IMediator mediator, ILoggedInUserService loggedInUser)
        {
            _mediator = mediator;
            _loggedInUser = loggedInUser;
        }



        [HttpGet]

        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetApprovalStatusListQueryResponse>> GetApprovalStatusList( )
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;

            //var xyz = _loggedInUser.TenantId;

            //var getEntityListQuery = new GetApprovalStatusListQuery() { CategoryID = categoryId, Category = category };

            //var dtos = await _mediator.Send(getEntityListQuery);

             var dtos = await _mediator.Send(new GetApprovalStatusListQuery() );

            return Ok(dtos);
        }




        [HttpGet("{id}", Name = "GetApprovalStatusByID")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<GetApprovalStatusDetailQueryResponse>> GetApprovalStatusByID(string id)
        {

            var getEntityDetailQuery = new GetApprovalStatusDetailQuery() { ApprovalStatusID = id };


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
        public async Task<ActionResult<CreateApprovalStatusCommandResponse>> PostApprovalStatus([FromBody] CreateApprovalStatusCommand createEntityCommand)
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
        public async Task<ActionResult<UpdateApprovalStatusCommandResponse>> PutApprovalStatus([FromBody] UpdateApprovalStatusCommand updateEntityCommand)
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


        [HttpDelete("{id}", Name = "DeleteApprovalStatus")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<DeleteApprovalStatusCommandResponse>> Delete(string id)
        {
            var deleteEntityCommand = new DeleteApprovalStatusCommand() { ApprovalStatusID = id };
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
