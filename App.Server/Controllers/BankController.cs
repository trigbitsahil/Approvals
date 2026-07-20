using MediatR;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Features.Global.Banks.Queries.GetBankList;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using OOH.Application.Features.Global.Banks.Commands.CreateBank;
using OOH.Application.Features.Global.Banks.Commands.UpdateBank;
using OOH.Application.Features.Global.Banks.Commands.DeleteBank;

namespace OOH.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class BankController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BankController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<BankListVM>>> GetAllBanks()
        {
            var dtos = await _mediator.Send(new GetBankListQuery());
            return Ok(new { success = true, data = dtos, message = "Banks fetched successfully." });
        }

        [HttpPost]
        public async Task<ActionResult> CreateBank([FromBody] CreateBankCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(new { success = true, data = result, message = "Bank created successfully." });
        }

        [HttpPut]
        public async Task<ActionResult> UpdateBank([FromBody] UpdateBankCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(new { success = result, message = result ? "Bank updated successfully." : "Bank not found." });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBank(string id)
        {
            var result = await _mediator.Send(new DeleteBankCommand { BankId = id });
            return Ok(new { success = result, message = result ? "Bank deleted successfully." : "Bank not found." });
        }

    }
}
