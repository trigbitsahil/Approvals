using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList;
using OOH.Application.Features.Global.BankTransactions.Queries.GetPendingBankTransactions;
using OOH.Application.Features.Global.BankTransactions.Commands.PayDistributor;
using OOH.Application.Features.Global.BankTransactions.Commands.ConfirmTransaction;
using OOH.Application.Features.Global.BankTransactions.Commands.ReceiveFromDistributor;

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
        public async Task<ActionResult<OOH.Application.Features.Global.BankTransactions.Queries.GetAllCombinedBankTransactions.GetAllCombinedBankTransactionsQueryResponse>> GetAllCombinedBankTransactions([FromQuery] string? approvalType = null)
        {
            var response = await _mediator.Send(new OOH.Application.Features.Global.BankTransactions.Queries.GetAllCombinedBankTransactions.GetAllCombinedBankTransactionsQuery { ApprovalType = approvalType });
            return Ok(new { success = true, data = response.Data, message = "Combined Bank Transactions fetched successfully." });
        }

        [HttpGet("pending")]
        public async Task<ActionResult<GetPendingBankTransactionsQueryResponse>> GetPendingBankTransactions([FromQuery] string? approvalType = null)
        {
            var response = await _mediator.Send(new GetPendingBankTransactionsQuery { ApprovalType = approvalType });
            return Ok(new { success = response.Success, data = response.Data, message = "Pending Bank Transactions fetched successfully." });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetBankTransactionsListQueryResponse>> GetBankTransactionsByBankId(string id)
        {
            var response = await _mediator.Send(new OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionById.GetBankTransactionByIdQuery { BankId = id });
            return Ok(new { success = true, data = response.Data, message = "Bank Transactions fetched successfully." });
        }

        [HttpGet("distributor/{id}")]
        public async Task<ActionResult<OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDistributorId.GetBankTransactionsByDistributorIdQueryResponse>> GetBankTransactionsByDistributorId(string id, [FromQuery] string? status = null)
        {
            var response = await _mediator.Send(new OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDistributorId.GetBankTransactionsByDistributorIdQuery { DistributorId = id, Status = status });
            return Ok(new { success = true, data = response.Data, message = "Distributor Bank Transactions fetched successfully." });
        }

        [HttpGet("debtor/{id}")]
        public async Task<ActionResult<OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDebtorId.GetBankTransactionsByDebtorIdQueryResponse>> GetBankTransactionsByDebtorId(string id, [FromQuery] string? status = null)
        {
            var response = await _mediator.Send(new OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByDebtorId.GetBankTransactionsByDebtorIdQuery { DebtorId = id, Status = status });
            return Ok(new { success = true, data = response.Data, message = "Debtor Bank Transactions fetched successfully." });
        }

        [HttpGet("vendor/{id}")]
        public async Task<ActionResult<OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByVendorId.GetBankTransactionsByVendorIdQueryResponse>> GetBankTransactionsByVendorId(string id)
        {
            var response = await _mediator.Send(new OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsByVendorId.GetBankTransactionsByVendorIdQuery { VendorId = id });
            return Ok(new { success = true, data = response.Data, message = "Vendor Bank Transactions fetched successfully." });
        }

        [HttpPost("pay-distributor")]
        public async Task<ActionResult<PayDistributorCommandResponse>> PayDistributor([FromBody] PayDistributorCommand command)
        {
            var response = await _mediator.Send(command);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpPost("confirm")]
        public async Task<ActionResult<ConfirmTransactionCommandResponse>> ConfirmTransaction([FromBody] ConfirmTransactionCommand command)
        {
            var response = await _mediator.Send(command);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpPost("receive-from-distributor")]
        public async Task<ActionResult<ReceiveFromDistributorCommandResponse>> ReceiveFromDistributor([FromBody] ReceiveFromDistributorCommand command)
        {
            var response = await _mediator.Send(command);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
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
