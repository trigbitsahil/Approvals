using System.Threading.Tasks;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.CreateApprovalRetentionSetting;
using OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.DeleteApprovalRetentionSetting;
using OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.PurgeExpiredApprovals;
using OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.UpdateApprovalRetentionSetting;
using OOH.Application.Features.Global.ApprovalRetentionSettings.Queries.GetApprovalRetentionSetting;

namespace OOH.API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion(1)]
    [Authorize]
    public class ApprovalRetentionController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ApprovalRetentionController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GetApprovalRetentionSettingQueryResponse>> Get()
        {
            var response = await _mediator.Send(new GetApprovalRetentionSettingQuery());
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CreateApprovalRetentionSettingCommandResponse>> Create([FromBody] CreateApprovalRetentionSettingCommand command)
        {
            var response = await _mediator.Send(command);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UpdateApprovalRetentionSettingCommandResponse>> Update([FromBody] UpdateApprovalRetentionSettingCommand command)
        {
            var response = await _mediator.Send(command);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DeleteApprovalRetentionSettingCommandResponse>> Delete(string id)
        {
            var response = await _mediator.Send(new DeleteApprovalRetentionSettingCommand { SettingId = id });
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPost("purge")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PurgeExpiredApprovalsCommandResponse>> Purge([FromBody] PurgeExpiredApprovalsCommand? command)
        {
            var cmd = command ?? new PurgeExpiredApprovalsCommand();
            var response = await _mediator.Send(cmd);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
