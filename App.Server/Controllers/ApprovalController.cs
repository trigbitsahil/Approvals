
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Features.Global.Approvals.Commands.CreateApproval;
using OOH.Application.Features.Global.Approvals.Commands.DeleteApproval;
using OOH.Application.Features.Global.Approvals.Commands.UpdateApproval;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalList;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalListByUser;
using OOH.Application.Models.Mail;

namespace OOH.API.Controllers
{

    [ApiController]
    [Route("api/v{version:apiVersion}/Approval")]
    [ApiVersion(1)]

    [Authorize]
    public class ApprovalController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;


        private readonly IEmailService _emailService;

        public ApprovalController(IMediator mediator, ILoggedInUserService loggedInUser , IEmailService emailService)
        {
            _mediator = mediator;
            _loggedInUser = loggedInUser;
            _emailService = emailService;
        }



        [HttpGet]

        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetApprovalListQueryResponse>> GetApprovalList(string category,string categoryId)
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;

            //var xyz = _loggedInUser.TenantId;

            var getEntityListQuery = new GetApprovalListQuery() { CategoryID = categoryId, Category = category };

            var dtos = await _mediator.Send(getEntityListQuery);

           // var dtos = await _mediator.Send(new GetApprovalListQuery() );

            return Ok(dtos);
        }




 

        [HttpGet("GetApprovalListByUser", Name = "GetApprovalListByUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetApprovalListQueryResponse>> GetApprovalListByUser()
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;

            //var xyz = _loggedInUser.TenantId;

            //var getEntityListQuery = new GetApprovalListByUserQuery() { CategoryID = categoryId, Category = category };

            //var dtos = await _mediator.Send(getEntityListQuery);

             var dtos = await _mediator.Send(new GetApprovalListByUserQuery() );

            return Ok(dtos);
        }



        [HttpGet("{id}", Name = "GetApprovalByID")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<GetApprovalDetailQueryResponse>> GetApprovalByID(string id)
        {

            var getEntityDetailQuery = new GetApprovalDetailQuery() { ApprovalID = id };


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
        public async Task<ActionResult<CreateApprovalCommandResponse>> PostApproval([FromBody] CreateApprovalCommand createEntityCommand)
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
        public async Task<ActionResult<UpdateApprovalCommandResponse>> PutApproval([FromBody] UpdateApprovalCommand updateEntityCommand)
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


        [HttpDelete("{id}", Name = "DeleteApproval")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<DeleteApprovalCommandResponse>> Delete(string id)
        {
            var deleteEntityCommand = new DeleteApprovalCommand() { ApprovalID = id };
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
