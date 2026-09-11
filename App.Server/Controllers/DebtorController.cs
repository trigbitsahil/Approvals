using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Features.Tenders.Debtors.Commands.CreateDebtor;
using OOH.Application.Features.Tenders.Debtors.Commands.DeleteDebtor;
using OOH.Application.Features.Tenders.Debtors.Commands.UpdateDebtor;
using OOH.Application.Features.Tenders.Debtors.Queries.GetDebtorDetail;
using OOH.Application.Features.Tenders.Debtors.Queries.GetDebtorList;

namespace OOH.API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/Debtor")]
    [ApiVersion(1)]
    [Authorize]
    public class DebtorController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;

        public DebtorController(IMediator mediator, ILoggedInUserService loggedInUser)
        {
            _mediator = mediator;
            _loggedInUser = loggedInUser;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GetDebtorListQueryResponse>> GetDebtorList()
        {
            var dtos = await _mediator.Send(new GetDebtorListQuery());
            return Ok(dtos);
        }

        [HttpGet("{id}", Name = "GetDebtorByID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetDebtorDetailQueryResponse>> GetDebtorByID(string id)
        {
            var getEntityDetailQuery = new GetDebtorDetailQuery() { DebtorID = id };
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
        public async Task<ActionResult<CreateDebtorCommandResponse>> PostDebtor([FromBody] CreateDebtorCommand createEntityCommand)
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
        public async Task<ActionResult<UpdateDebtorCommandResponse>> PutDebtor([FromBody] UpdateDebtorCommand updateEntityCommand)
        {
            var response = await _mediator.Send(updateEntityCommand);

            if (response.Success)
            {
                return Ok(response);
            }

            response.Message = "Error Updating the record";
            return BadRequest(response);
        }

        [HttpDelete("{id}", Name = "DeleteDebtor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<DeleteDebtorCommandResponse>> Delete(string id)
        {
            var deleteEntityCommand = new DeleteDebtorCommand() { DebtorId = id };
            var response = await _mediator.Send(deleteEntityCommand);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }
    }
}
