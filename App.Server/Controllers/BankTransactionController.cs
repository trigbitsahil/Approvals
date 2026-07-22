using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList;

namespace OOH.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class BankTransactionController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BankTransactionController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<GetBankTransactionsListQueryResponse>> GetAllBankTransactions()
        {
            var response = await _mediator.Send(new GetBankTransactionsListQuery());
            return Ok(new { success = true, data = response.Data, message = "Bank Transactions fetched successfully." });
        }

        [HttpGet("AllBankTransactions")]
        public async Task<ActionResult<OOH.Application.Features.Global.BankTransactions.Queries.GetAllCombinedBankTransactions.GetAllCombinedBankTransactionsQueryResponse>> GetAllCombinedBankTransactions()
        {
            var response = await _mediator.Send(new OOH.Application.Features.Global.BankTransactions.Queries.GetAllCombinedBankTransactions.GetAllCombinedBankTransactionsQuery());
            return Ok(new { success = true, data = response.Data, message = "Combined Bank Transactions fetched successfully." });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetBankTransactionsListQueryResponse>> GetBankTransactionsByBankId(string id)
        {
            var response = await _mediator.Send(new OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionById.GetBankTransactionByIdQuery { BankId = id });
            return Ok(new { success = true, data = response.Data, message = "Bank Transactions fetched successfully." });
        }

        [HttpPost("reverse/{id}")]
        public async Task<ActionResult> ReverseBankTransaction(string id)
        {
            var result = await _mediator.Send(new OOH.Application.Features.Global.BankTransactions.Commands.ReverseBankTransaction.ReverseBankTransactionCommand { ApprovalId = id });
            
            if (result)
            {
                return Ok(new { success = true, message = "Bank Transaction reversed successfully." });
            }
            
            return BadRequest(new { success = false, message = "Failed to reverse transaction or transaction not found." });
        }
    }
}
