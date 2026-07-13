
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Features.Tenders.Vendors.Commands.CreateVendor;
using OOH.Application.Features.Tenders.Vendors.Commands.DeleteVendor;
using OOH.Application.Features.Tenders.Vendors.Commands.UpdateVendor;
using OOH.Application.Features.Tenders.Vendors.Queries.GetVendorDetail;
using OOH.Application.Features.Tenders.Vendors.Queries.GetVendorList;

namespace OOH.API.Controllers
{

    [ApiController]
    [Route("api/v{version:apiVersion}/Vendor")]
    [ApiVersion(1)]

    [Authorize]
    public class VendorController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;

        public VendorController(IMediator mediator, ILoggedInUserService loggedInUser)
        {
            _mediator = mediator;
            _loggedInUser = loggedInUser;
        }



        [HttpGet]

        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetVendorListQueryResponse>> GetVendorList( )
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;

            //var xyz = _loggedInUser.TenantId;

            //var getEntityListQuery = new GetVendorListQuery() { CategoryID = categoryId, Category = category };

            //var dtos = await _mediator.Send(getEntityListQuery);

             var dtos = await _mediator.Send(new GetVendorListQuery() );

            return Ok(dtos);
        }




        [HttpGet("{id}", Name = "GetVendorByID")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<GetVendorDetailQueryResponse>> GetVendorByID(string id)
        {

            var getEntityDetailQuery = new GetVendorDetailQuery() { VendorID = id };


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
        public async Task<ActionResult<CreateVendorCommandResponse>> PostVendor([FromBody] CreateVendorCommand createEntityCommand)
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
        public async Task<ActionResult<UpdateVendorCommandResponse>> PutVendor([FromBody] UpdateVendorCommand updateEntityCommand)
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


        [HttpDelete("{id}", Name = "DeleteVendor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<DeleteVendorCommandResponse>> Delete(string id)
        {
            var deleteEntityCommand = new DeleteVendorCommand() { VendorID = id };
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
