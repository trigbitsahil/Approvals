
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Features.Global.ApprovalTypes.Commands.CreateApprovalType;
using OOH.Application.Features.Global.ApprovalTypes.Commands.DeleteApprovalType;
using OOH.Application.Features.Global.ApprovalTypes.Commands.UpdateApprovalType;
using OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeDetail;
using OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeList;

namespace OOH.API.Controllers
{

    [ApiController]
    [Route("api/v{version:apiVersion}/ApprovalType")]
    [ApiVersion(1)]

    [Authorize]
    public class ApprovalTypeController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;

        public ApprovalTypeController(IMediator mediator, ILoggedInUserService loggedInUser)
        {
            _mediator = mediator;
            _loggedInUser = loggedInUser;
        }



        [HttpGet]

        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetApprovalTypeListQueryResponse>> GetApprovalTypeList( )
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;

            //var xyz = _loggedInUser.TenantId;

            //var getEntityListQuery = new GetApprovalTypeListQuery() { CategoryID = categoryId, Category = category };

            //var dtos = await _mediator.Send(getEntityListQuery);

            var dtos = await _mediator.Send(new GetApprovalTypeListQuery() );

            return Ok(dtos);
        }




        [HttpGet("{id}", Name = "GetApprovalTypeByID")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<GetApprovalTypeDetailQueryResponse>> GetApprovalTypeByID(string id)
        {

            var getEntityDetailQuery = new GetApprovalTypeDetailQuery() { ApprovalTypeID = id };


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
        public async Task<ActionResult<CreateApprovalTypeCommandResponse>> PostApprovalType([FromBody] CreateApprovalTypeCommand createEntityCommand)
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
        public async Task<ActionResult<UpdateApprovalTypeCommandResponse>> PutApprovalType([FromBody] UpdateApprovalTypeCommand updateEntityCommand)
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


        [HttpDelete("{id}", Name = "DeleteApprovalType")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<DeleteApprovalTypeCommandResponse>> Delete(string id)
        {
            var deleteEntityCommand = new DeleteApprovalTypeCommand() { ApprovalTypeID = id };
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
