using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Features.Tenders.Distributors.Commands.CreateDistributor;
using OOH.Application.Features.Tenders.Distributors.Commands.DeleteDistributor;
using OOH.Application.Features.Tenders.Distributors.Commands.UpdateDistributor;
using OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorDetail;
using OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorList;
using OOH.Application.Features.Tenders.Distributors.Queries.GetDistributorSummary;
using System.Threading.Tasks;

namespace OOH.API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/Distributor")]
    [ApiVersion(1)]
    [Authorize]
    public class DistributorController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;

        public DistributorController(IMediator mediator, ILoggedInUserService loggedInUser)
        {
            _mediator = mediator;
            _loggedInUser = loggedInUser;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GetDistributorListQueryResponse>> GetDistributorList()
        {
            var dtos = await _mediator.Send(new GetDistributorListQuery());
            return Ok(dtos);
        }

        [HttpGet("{id}", Name = "GetDistributorByID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetDistributorDetailQueryResponse>> GetDistributorByID(string id)
        {
            var getEntityDetailQuery = new GetDistributorDetailQuery() { DistributorID = id };
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

        [HttpGet("{id}/summary", Name = "GetDistributorSummary")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GetDistributorSummaryQueryResponse>> GetDistributorSummary(string id)
        {
            var response = await _mediator.Send(new GetDistributorSummaryQuery { DistributorId = id });
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CreateDistributorCommandResponse>> PostDistributor([FromBody] CreateDistributorCommand createEntityCommand)
        {
            var response = await _mediator.Send(createEntityCommand);

            if (response.Success)
            {
                return Ok(response);
            }

            response.Message = "Error creating the record";
            return BadRequest(response);
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UpdateDistributorCommandResponse>> PutDistributor([FromBody] UpdateDistributorCommand updateEntityCommand)
        {
            var response = await _mediator.Send(updateEntityCommand);

            if (response.Success)
            {
                return Ok(response);
            }

            response.Message = "Error Updating the record";
            return BadRequest(response);
        }

        [HttpDelete("{id}", Name = "DeleteDistributor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<DeleteDistributorCommandResponse>> Delete(string id)
        {
            var deleteEntityCommand = new DeleteDistributorCommand() { DistributorId = id };
            var response = await _mediator.Send(deleteEntityCommand);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }
    }
}
