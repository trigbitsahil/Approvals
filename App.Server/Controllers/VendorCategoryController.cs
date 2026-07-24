using MediatR;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Features.Global.VendorCategories.Commands.CreateVendorCategory;
using OOH.Application.Features.Global.VendorCategories.Commands.UpdateVendorCategory;
using OOH.Application.Features.Global.VendorCategories.Commands.DeleteVendorCategory;
using OOH.Application.Features.Global.VendorCategories.Queries.GetVendorCategoryDetail;
using OOH.Application.Features.Global.VendorCategories.Queries.GetVendorCategoryList;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace App.Server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class VendorCategoryController : ControllerBase
    {
        private readonly IMediator _mediator;

        public VendorCategoryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<VendorCategoryListVM>>> GetAllVendorCategories()
        {
            var dtos = await _mediator.Send(new GetVendorCategoryListQuery());
            return Ok(dtos);
        }

        [HttpGet("{id}", Name = "GetVendorCategoryById")]
        public async Task<ActionResult<VendorCategoryDetailVM>> GetVendorCategoryById(string id)
        {
            var getVendorCategoryDetailQuery = new GetVendorCategoryDetailQuery { VendorCategoryId = id };
            var result = await _mediator.Send(getVendorCategoryDetailQuery);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<CreateVendorCategoryCommandResponse>> Create([FromBody] CreateVendorCategoryCommand createVendorCategoryCommand)
        {
            var response = await _mediator.Send(createVendorCategoryCommand);
            return Ok(response);
        }

        [HttpPut]
        public async Task<ActionResult<UpdateVendorCategoryCommandResponse>> Update([FromBody] UpdateVendorCategoryCommand updateVendorCategoryCommand)
        {
            var response = await _mediator.Send(updateVendorCategoryCommand);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var deleteVendorCategoryCommand = new DeleteVendorCategoryCommand { VendorCategoryId = id };
            await _mediator.Send(deleteVendorCategoryCommand);
            return NoContent();
        }
    }
}
