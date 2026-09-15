using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Features.Global.DocumentUrls.Commands.CreateDocumentUrl;
using OOH.Application.Features.Global.DocumentUrls.Commands.DeleteDocumentUrl;
using OOH.Application.Features.Global.DocumentUrls.Commands.UpdateDocumentUrl;
using OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlDetail;
using OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlList;
using System.Threading.Tasks;

namespace OOH.API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/Documents")]
    [ApiVersion(1)]
    [Authorize]
    public class DocumentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DocumentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GetDocumentUrlListQueryResponse>> GetDocuments([FromQuery] string? category, [FromQuery] string? categoryId)
        {
            var query = new GetDocumentUrlListQuery { Category = category, CategoryId = categoryId };
            var response = await _mediator.Send(query);
            return Ok(response);
        }

        [HttpGet("GetByType")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GetDocumentUrlListQueryResponse>> GetByType([FromQuery] string? docType, [FromQuery] string? docTypeId)
        {
            var query = new GetDocumentUrlListQuery { DocType = docType, DocTypeId = docTypeId };
            var response = await _mediator.Send(query);
            return Ok(response);
        }

        [HttpGet("SearchDocuments")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GetDocumentUrlListQueryResponse>> SearchDocuments([FromQuery] string? searchText, [FromQuery] string? categoryType, [FromQuery] string? categoryTypeID)
        {
            var query = new GetDocumentUrlListQuery { SearchText = searchText, Category = categoryType, CategoryId = categoryTypeID };
            var response = await _mediator.Send(query);
            return Ok(response);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetDocumentUrlDetailQueryResponse>> GetDocumentById(string id)
        {
            var query = new GetDocumentUrlDetailQuery { DocumentUrlId = id };
            var response = await _mediator.Send(query);
            if (response.Success && response.Data != null)
            {
                return Ok(response);
            }
            return NotFound(response);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CreateDocumentUrlCommandResponse>> PostDocument([FromBody] CreateDocumentUrlCommand createCommand)
        {
            var response = await _mediator.Send(createCommand);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UpdateDocumentUrlCommandResponse>> PutDocument([FromBody] UpdateDocumentUrlCommand updateCommand)
        {
            var response = await _mediator.Send(updateCommand);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DeleteDocumentUrlCommandResponse>> DeleteDocument(string id)
        {
            var command = new DeleteDocumentUrlCommand { DocumentUrlId = id };
            var response = await _mediator.Send(command);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
    }
}
