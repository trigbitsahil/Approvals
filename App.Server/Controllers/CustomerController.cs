
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Features.Global.Customers.Commands.CreateCustomer;
using OOH.Application.Features.Global.Customers.Commands.DeleteCustomer;
using OOH.Application.Features.Global.Customers.Commands.UpdateCustomer;
using OOH.Application.Features.Global.Customers.Queries.GetCustomerDetail;
using OOH.Application.Features.Global.Customers.Queries.GetCustomerList;

namespace OOH.API.Controllers
{

    [ApiController]
    [Route("api/v{version:apiVersion}/Customer")]
    [ApiVersion(1)]

    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;

        public CustomerController(IMediator mediator, ILoggedInUserService loggedInUser)
        {
            _mediator = mediator;
            _loggedInUser = loggedInUser;
        }



        [HttpGet]

        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetCustomerListQueryResponse>> GetCustomerList()
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;

            //var xyz = _loggedInUser.TenantId;

            //var getEntityListQuery = new GetCustomerListQuery() { CategoryID = categoryId, Category = category };

            //var dtos = await _mediator.Send(getEntityListQuery);

           var dtos = await _mediator.Send(new GetCustomerListQuery() );

            return Ok(dtos);
        }




        [HttpGet("{id}", Name = "GetCustomerByID")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<GetCustomerDetailQueryResponse>> GetCustomerByID(string id)
        {

            var getEntityDetailQuery = new GetCustomerDetailQuery() { CustomerId = id };


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
        public async Task<ActionResult<CreateCustomerCommandResponse>> PostCustomer([FromBody] CreateCustomerCommand createEntityCommand)
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
        public async Task<ActionResult<UpdateCustomerCommandResponse>> PutCustomer([FromBody] UpdateCustomerCommand updateEntityCommand)
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


        [HttpDelete("{id}", Name = "DeleteCustomer")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<DeleteCustomerCommandResponse>> Delete(string id)
        {
            var deleteEntityCommand = new DeleteCustomerCommand() { CustomerId = id };
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
