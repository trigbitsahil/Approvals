
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Features.Tenders.ExpenseTransactions.Commands.CreateExpenseTransaction;
using OOH.Application.Features.Tenders.ExpenseTransactions.Commands.DeleteExpenseTransaction;
using OOH.Application.Features.Tenders.ExpenseTransactions.Commands.UpdateExpenseTransaction;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList2;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListByVendor;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListForApproval;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionSearch;

namespace OOH.API.Controllers
{

    [ApiController]
    [Route("api/v{version:apiVersion}/ExpenseTransaction")]
    [ApiVersion(1)]

    [Authorize]
    public class ExpenseTransactionController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;

        public ExpenseTransactionController(IMediator mediator, ILoggedInUserService loggedInUser)
        {
            _mediator = mediator;
            _loggedInUser = loggedInUser;
        }



        [HttpGet]

        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetExpenseTransactionListQueryResponse>> GetExpenseTransactionList(string category, string categoryID)
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;

            //var xyz = _loggedInUser.TenantId;

            var getEntityListQuery = new GetExpenseTransactionListQuery() { Category = category, CategoryID = categoryID };

            var dtos = await _mediator.Send(getEntityListQuery);

           // var dtos = await _mediator.Send(new GetExpenseTransactionListQuery() );

            return Ok(dtos);
        }




        [HttpGet("GetExpenseTransactionList2", Name = "GetExpenseTransactionList2")]


        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetExpenseTransactionList2QueryResponse>> GetExpenseTransactionList2(string category, string categoryID)
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;

            //var xyz = _loggedInUser.TenantId;

            var getEntityListQuery = new GetExpenseTransactionList2Query() { Category = category, CategoryID = categoryID };

            var dtos = await _mediator.Send(getEntityListQuery);

            // var dtos = await _mediator.Send(new GetExpenseTransactionListQuery() );

            return Ok(dtos);
        }



        [HttpGet("GetExpenseTransactionListByVendor", Name = "GetExpenseTransactionListByVendor")]


        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetExpenseTransactionListByVendorQueryResponse>> GetExpenseTransactionListByVendor(string mediaId, string vendorId)
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;
            //var xyz = _loggedInUser.TenantId;

            var getEntityListQuery = new GetExpenseTransactionListByVendorQuery() {  MediaId  = mediaId, VendorId = vendorId };

            var dtos = await _mediator.Send(getEntityListQuery);

            // var dtos = await _mediator.Send(new GetExpenseTransactionListQuery() );

            return Ok(dtos);
        }

     
        
        [HttpGet("GetExpenseTransactionSearch", Name = "GetExpenseTransactionSearch")]


        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetExpenseTransactionSearchQueryResponse>> GetExpenseTransactionSearch(string? mediaId, string? expenseId, string? expenseTypeId, string? vendorId)
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;
            //var xyz = _loggedInUser.TenantId;

            var getEntityListQuery = new GetExpenseTransactionSearchQuery() { MediaIds = mediaId, ExpenseId = expenseId, ExpenseTypeId = expenseTypeId , VendorId = vendorId };

            var dtos = await _mediator.Send(getEntityListQuery);

            // var dtos = await _mediator.Send(new GetExpenseTransactionListQuery() );

            return Ok(dtos);
        }



        [HttpGet("GetExpenseTransactionListForApproval", Name = "GetExpenseTransactionListForApproval")]


        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<GetExpenseTransactionListForApprovalQueryResponse>> GetExpenseTransactionListForApproval( )
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;

            //var xyz = _loggedInUser.TenantId;

            //var getEntityListQuery = new GetExpenseTransactionListForApprovalQuery() { Category = category, CategoryID = categoryID };

            //var dtos = await _mediator.Send(getEntityListQuery);

            var dtos = await _mediator.Send(new GetExpenseTransactionListForApprovalQuery() );

            return Ok(dtos);
        }



        [HttpGet("{id}", Name = "GetExpenseTransactionByID")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<GetExpenseTransactionDetailQueryResponse>> GetExpenseTransactionByID(string id)
        {

            var getEntityDetailQuery = new GetExpenseTransactionDetailQuery() { ExpenseTransactionID = id };


            var dtos = await _mediator.Send(getEntityDetailQuery);

            if (dtos.Data != null)
            {

                return Ok(dtos);


            }
            else
            {
                return NotFound(dtos);

            }


        }


        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CreateExpenseTransactionCommandResponse>> PostExpenseTransaction([FromBody] CreateExpenseTransactionCommand createEntityCommand)
        {
            var response = await _mediator.Send(createEntityCommand);

            if (response.Success)
            {

                return Ok(response);

            }
            {
                response.Message = "Error creating the record";
                return BadRequest(response);


            }

        }


        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UpdateExpenseTransactionCommandResponse>> PutExpenseTransaction([FromBody] UpdateExpenseTransactionCommand updateEntityCommand)
        {
            var response = await _mediator.Send(updateEntityCommand);

            if (response.Success)
            {

                return Ok(response);

            }
            {
                response.Message = "Error Updating the record";
                return BadRequest(response);
            }

        }


        [HttpDelete("{id}", Name = "DeleteExpenseTransaction")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<DeleteExpenseTransactionCommandResponse>> Delete(string id)
        {
            var deleteEntityCommand = new DeleteExpenseTransactionCommand() { ExpenseTransactionID = id };
            var response = await _mediator.Send(deleteEntityCommand);


            if (response.Success)
            {
                return Ok(response);
            }
            {
                return BadRequest(response);
            }
        }

    }
}
