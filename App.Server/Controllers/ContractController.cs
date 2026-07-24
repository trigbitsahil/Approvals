using MediatR;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Features.Global.Contracts.Commands.CreateContract;
using OOH.Application.Features.Global.Contracts.Commands.UpdateContract;
using OOH.Application.Features.Global.Contracts.Commands.DeleteContract;
using OOH.Application.Features.Global.Contracts.Queries.GetContractDetail;
using OOH.Application.Features.Global.Contracts.Queries.GetContractList;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace App.Server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ContractController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ContractController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<ContractListVM>>> GetAllContracts()
        {
            var dtos = await _mediator.Send(new GetContractListQuery());
            return Ok(dtos);
        }

        [HttpGet("{id}", Name = "GetContractById")]
        public async Task<ActionResult<ContractDetailVM>> GetContractById(string id)
        {
            var getContractDetailQuery = new GetContractDetailQuery { ContractId = id };
            var result = await _mediator.Send(getContractDetailQuery);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<CreateContractCommandResponse>> Create([FromBody] CreateContractCommand createContractCommand)
        {
            var response = await _mediator.Send(createContractCommand);
            return Ok(response);
        }

        [HttpPut]
        public async Task<ActionResult<UpdateContractCommandResponse>> Update([FromBody] UpdateContractCommand updateContractCommand)
        {
            var response = await _mediator.Send(updateContractCommand);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var deleteContractCommand = new DeleteContractCommand { ContractId = id };
            await _mediator.Send(deleteContractCommand);
            return NoContent();
        }
    }
}
