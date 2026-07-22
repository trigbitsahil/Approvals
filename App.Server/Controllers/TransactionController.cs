using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Features.Global.Transactions.Commands.ClearTransactionalData;
using OOH.Application.Features.Global.Transactions.Commands.CreateTransaction;
using OOH.Application.Features.Global.Transactions.Commands.UpdateTransactionStatus;
using OOH.Application.Features.Global.Transactions.Queries.GetDashboards;
using OOH.Application.Features.Global.Transactions.Queries.GetTransactions;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Linq;

namespace App.Server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class TransactionController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TransactionController(IMediator mediator)
        {
            _mediator = mediator;
        }

        private bool HasActualViewPermission()
        {
            // Example logic: Check if user has "Admin" or "FinanceManager" role
            // This satisfies the requirement: "Normal View (restricted) vs Actual View (complete data)"
            return User.Claims.Any(c => c.Type == ClaimTypes.Role && (c.Value == "SuperAdmin" || c.Value == "Admin" || c.Value == "FinanceManager"));
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(new { TransactionId = result });
        }

        [HttpPut("status")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateTransactionStatusCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result) return NotFound();
            return Ok(new { Success = true });
        }

        [HttpGet]
        public async Task<IActionResult> GetTransactions()
        {
            var query = new GetTransactionsQuery { HasActualViewPermission = HasActualViewPermission() };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var query = new GetDashboardsQuery { HasActualViewPermission = HasActualViewPermission() };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // SOS UTILITY - Strictly restricted to Admin
        [Authorize(Roles = "Admin")]
        [HttpDelete("sos/clear")]
        public async Task<IActionResult> ClearTransactionalData([FromBody] ClearTransactionalDataCommand command)
        {
            // Highly dangerous operation
            var result = await _mediator.Send(command);
            return Ok(new { Success = result, Message = "All transactional data cleared." });
        }
    }
}
