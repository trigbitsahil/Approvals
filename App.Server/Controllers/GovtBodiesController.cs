//using Asp.Versioning;
//using Azure;
//using MediatR;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using OOH.Application.Contracts.Infrastructure;
//using OOH.Application.Features.Tenders.Cities.Queries.GetCityList;
//using OOH.Application.Features.Tenders.GovtBodies.Commands.CreateGovtBody;
//using OOH.Application.Features.Tenders.GovtBodies.Commands.DeleteGovtBody;
//using OOH.Application.Features.Tenders.GovtBodies.Commands.UpdateGovtBody;
//using OOH.Application.Features.Tenders.GovtBodies.Queries.GetGovtBodyDetail;
//using OOH.Application.Features.Tenders.GovtBodies.Queries.GetGovtBodyList;
//using OOH.Application.Features.Tenders.GovtBodies.Queries.GetGovtList;
 

//namespace OOH.API.Controllers
//{
//    [ApiController]
//    // [Route("api/cities")]
//    [Route("api/v{version:apiVersion}/govtbodies")]
//    //  [Authorize]
//    [ApiVersion(1)]
//    [ApiVersion(2)]

//    [Authorize]
//    public class GovtBodiesController : ControllerBase
//    {
//        private readonly IMediator _mediator;
//        private readonly ILoggedInUserService _loggedInUser;

//        public GovtBodiesController(IMediator mediator, ILoggedInUserService loggedInUser)
//        {
//            _mediator = mediator;
//            _loggedInUser = loggedInUser;
//        }

//        //  [HttpGet("all", Name = "GetAllCategories")]
//        [HttpGet]

//        [ProducesResponseType(StatusCodes.Status200OK)]
      
//        public async Task<ActionResult<GetGovtBodyListQueryResponse>> GetGovtBodies()
//        {
//           // var abd = _loggedInUser.UserId;
//            var dtos = await _mediator.Send(new GetGovtBodyListQuery());
//            return Ok(dtos);
//        }


//        [HttpGet("{id}", Name = "GetByID")]

//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status404NotFound)]

//        public async Task<ActionResult<GetGovtBodyDetailQueryResponse>> GetByGovtBodiesID(string id)
//        {

//            var getGovtBodyDetailQuery = new GetGovtBodyDetailQuery() { GovtBodyID = id };


//            var dtos = await _mediator.Send(getGovtBodyDetailQuery);

//            if (dtos.Data != null)
//            {

//                return Ok(dtos);


//            }
//            else
//            {
//                return NotFound(dtos);

//            }


//        }


//        [HttpPost]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        public async Task<ActionResult<CreateGovtBodyCommandResponse>> PostGovtBodies([FromBody] CreateGovtBodyCommand createGovtBodyCommand)
//        {
//            var response = await _mediator.Send(createGovtBodyCommand);

//            if (response.Success)
//            {

//                return Ok(response);

//            }
//            {
//                response.Message = "Error creating the record";
//                return BadRequest(response);


//            }

//        }


//        [HttpPut]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        public async Task<ActionResult<UpdateGovtBodyCommandResponse>> PutGovtBodies([FromBody] UpdateGovtBodyCommand updateGovtBodyCommand)
//        {
//            var response = await _mediator.Send(updateGovtBodyCommand);

//            if (response.Success)
//            {

//                return Ok(response);

//            }
//            {
//                response.Message = "Error Updating the record";
//                return BadRequest(response);
//            }

//        }


//        [HttpDelete("{id}", Name = "Delete")]
//        //[ProducesResponseType(StatusCodes.Status204NoContent)]
//        //[ProducesResponseType(StatusCodes.Status404NotFound)]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        [ProducesDefaultResponseType]
//        public async Task<ActionResult<DeleteGovtBodyCommandResponse>> Delete(string id)
//        {
//            var deleteGovtBodyCommand = new DeleteGovtBodyCommand() { GovtBodyID = id };
//            var response= await _mediator.Send(deleteGovtBodyCommand);
            

//            if (response.Success)
//            {

//                return Ok(response);

//            }
//            {
//                return BadRequest(response);
//            }

       
//        }



//        //[HttpPost]
//        //public async Task<ActionResult<List<GovtBodyListVM>>> PostGovtBodies()
//        //{
//        //    var dtos = await _mediator.Send(new CreateGovtBodyCommand());
//        //    return Ok(dtos);
//        //}
//    }
//}
