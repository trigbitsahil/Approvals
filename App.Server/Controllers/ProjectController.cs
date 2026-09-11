using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Features.Global.Projects.Queries.GetProjectList;
using System.Threading.Tasks;

namespace OOH.API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/Project")]
    [ApiVersion(1)]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProjectController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GetProjectListQueryResponse>> GetProjects()
        {
            var result = await _mediator.Send(new GetProjectListQuery());
            return Ok(result);
        }
    }
}
