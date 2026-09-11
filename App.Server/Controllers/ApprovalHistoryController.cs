using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Features.Global.ApprovalHistories.Queries.GetApprovalHistoryList;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OOH.API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/ApprovalHistory")]
    [ApiVersion(1)]
    [Authorize]
    public class ApprovalHistoryController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ApprovalHistoryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{approvalId}")]
        public async Task<ActionResult<List<ApprovalHistoryListVM>>> GetApprovalHistory(string approvalId)
        {
            var query = new GetApprovalHistoryListQuery(approvalId);
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
