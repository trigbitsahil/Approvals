
using Asp.Versioning;
 
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Features.Global.ApprovalApprovers.Commands.CreateApprovalApprover;
using OOH.Application.Features.Global.ApprovalApprovers.Commands.DeleteApprovalApprover;
using OOH.Application.Features.Global.ApprovalApprovers.Commands.UpdateApprovalApprover;
using OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverDetail;
using OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverList;
 
using OOH.Application.Models.Mail;
using OOH.Infrastructure.Services;
using System.Text.RegularExpressions;
using Tesseract;
using Microsoft.AspNetCore.StaticFiles;
 
using Azure;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalWithTypeDetail;

namespace OOH.API.Controllers
{

    [ApiController]
    [Route("api/v{version:apiVersion}/ApprovalApprover")]
    [ApiVersion(1)]

    [Authorize]
    public class ApprovalApproverController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILoggedInUserService _loggedInUser;
        private readonly IEmailService _emailService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        //private readonly IPdfService _pdfService;
        private readonly IBlobService _blobService;
        private readonly IConfiguration _configuration;

        public ApprovalApproverController(IMediator mediator, ILoggedInUserService loggedInUser,
            IEmailService emailService,
            IWebHostEnvironment webHostEnvironment,
        //    IPdfService pdfService,
            IBlobService blobService,
            IConfiguration configuration)
            
        {
            _mediator = mediator;
            _loggedInUser = loggedInUser;
            _emailService = emailService;
            _webHostEnvironment = webHostEnvironment;
         //   _pdfService = pdfService;
            _blobService = blobService;
            _configuration = configuration;

        }


        [HttpGet]

        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GetApprovalApproverListQueryResponse>> GetApprovalApproverList(string approvalID)
        {
            //var abd = _loggedInUser.UserId;
            //var def = _loggedInUser.UserEmail;
            //var xyz = _loggedInUser.TenantId;

            var getEntityListQuery = new GetApprovalApproverListQuery() { ApprovalID = approvalID };

            var dtos = await _mediator.Send(getEntityListQuery);

            // var dtos = await _mediator.Send(new GetApprovalApproverListQuery() );

            return Ok(dtos);
        }




        [HttpGet("{id}", Name = "GetApprovalApproverByID")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<GetApprovalApproverDetailQueryResponse>> GetApprovalApproverByID(string id)
        {

            var getEntityDetailQuery = new GetApprovalApproverDetailQuery() { ApprovalApproverID = id };

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







        [HttpGet("SendFollowUpEmail", Name = "SendFollowUpEmail")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DeleteApprovalApproverCommandResponse>> SendFollowUpEmail(string approvalID)
        {

            DeleteApprovalApproverCommandResponse response = new DeleteApprovalApproverCommandResponse();


            var getEntityListQuery = new GetApprovalApproverListQuery() { ApprovalID = approvalID };
            var dtos = await _mediator.Send(getEntityListQuery);
            bool isSent = false;

            if (dtos.Data != null)
            {

                EmailInfo objEmailInfo;


                foreach (var item in dtos.Data.Where(x => x.IsResponded == false).ToList())
                {
                    objEmailInfo = new EmailInfo($"Hi, please respond to the pending approval request.  " +
                        $". Please check the request on you approval list page or go to the  " +
                        $" link <a href='https://oohapp-afdpgggpdrd9aghz.centralindia-01.azurewebsites.net/Approval/ApprovalDetail/{approvalID}'> Here </a>" 
                        , item.ApprovalApproverEmail, "", "Follow Up Approval Request ", "dev@wallop.in", null);

                    isSent = await _emailService.SendEmail(objEmailInfo);

                }
                //if (isSent)
                //{
                //    return Ok(dtos);
                //}
                //else
                //{
                //    response.Message = "Record was created Error Send Email";
                //    return BadRequest(response);
                //} 

                return Ok(response);
            }
            else
            {
                return NotFound(response);

            }



        }



        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CreateApprovalApproverCommandResponse>> PostApprovalApprover([FromBody] CreateApprovalApproverCommand createEntityCommand)
        {
            var response = await _mediator.Send(createEntityCommand);
            bool isSent = false;

            string approvalDetailsText = string.Empty;
            if (response.Success)
            {

                GetApprovalWithTypeDetailQuery command = new GetApprovalWithTypeDetailQuery();

                command.ApprovalID = createEntityCommand.ApprovalID;

                GetApprovalWithTypeDetailQueryResponse response2 = await _mediator.Send(command);


                if (response2.Success)
                {

                    if (response2.Data.ApprovalDetails != null)
                    {

                        approvalDetailsText += "<br/> Approval:" + response2.Data.ApprovalDetails.Name.ToString();

                        approvalDetailsText += "<br/> Approval Description:" + response2.Data.ApprovalDetails.Description.ToString();

                        approvalDetailsText += "<br/> Approval Type:" + response2.Data.ApprovalDetails.ApprovalType.ToString();

                        approvalDetailsText += "<br/> Requested By:" + response2.Data.ApprovalDetails.RequestedBy.ToString();

                        approvalDetailsText += "<br/> Requested Date:" + response2.Data.ApprovalDetails.RequestedDate.ToShortDateString();

                        if (response2.Data.ApprovalDetails.DepartmentName != null)
                        {
                            approvalDetailsText += "<br/> Department Name:" + response2.Data.ApprovalDetails.DepartmentName.ToString();

                        }

                        if (!string.IsNullOrEmpty( response2.Data.ApprovalDetails.Category ))
                        {
                            approvalDetailsText += "<br/>   Category :" + response2.Data.ApprovalDetails.Category;

                        }

                        if (response2.Data.ApprovalDetails.ContractName != null)
                        {
                            approvalDetailsText += "<br/>   Name :" + response2.Data.ApprovalDetails.ContractName.ToString();

                        }

                        if (response2.Data.ApprovalDetails.MediaName != null)
                        {

                            approvalDetailsText += "<br/> Media Name:" + response2.Data.ApprovalDetails.MediaName.ToString();

                        }

                        if (response2.Data.ApprovalDetails.ApprovalType == "Letter")
                        {

                       

                        }

                        else if (response2.Data.ApprovalDetails.ApprovalType == "Expense")
                        {


                            approvalDetailsText += "<hr /> Expense Name :" + response2.Data.ExpenseTransactionDetails.Name.ToString();

                            approvalDetailsText += "<br/> Expense Description:" + response2.Data.ExpenseTransactionDetails.Description.ToString();

                            approvalDetailsText += "<br/> Date Of Expense :" + response2.Data.ExpenseTransactionDetails.DateOfExpense.ToShortDateString();

                            approvalDetailsText += "<br/> Expense Name:" + response2.Data.ExpenseTransactionDetails.ExpenseName.ToString();

                            approvalDetailsText += "<br/> Expense Type Name:" + response2.Data.ExpenseTransactionDetails.ExpenseTypeName.ToString();


                        }
                        else if (response2.Data.ApprovalDetails.ApprovalType == "OfficeNote")
                        {
 

                        }
                        else if (response2.Data.ApprovalDetails.ApprovalType == "Other")
                        {




                        }
                        else if (response2.Data.ApprovalDetails.ApprovalType == "FinanceExpense")
                        {


                            approvalDetailsText += "<hr />   Expense Name :" + response2.Data.ExpenseTransactionDetails.Name.ToString();

                            approvalDetailsText += "<br/> Expense Description:" + response2.Data.ExpenseTransactionDetails.Description.ToString();

                            approvalDetailsText += "<br/> Date Of Expense :" + response2.Data.ExpenseTransactionDetails.DateOfExpense.ToShortDateString();

                            approvalDetailsText += "<br/> Expense Name:" + response2.Data.ExpenseTransactionDetails.ExpenseName.ToString();

                            approvalDetailsText += "<br/> Expense Type Name:" + response2.Data.ExpenseTransactionDetails.ExpenseTypeName.ToString();


                        }

                    }
                }

                EmailInfo objEmailInfo = new EmailInfo($"Hi, A new approval request  is created  . " +
                    $" <hr />  " + approvalDetailsText +
                     "<br/> " +
                    $" <hr />  Please check the request on you approval list page or go to the  link <a href='https://oohapp-afdpgggpdrd9aghz.centralindia-01.azurewebsites.net/Approval/ApprovalDetail/{createEntityCommand.ApprovalID}'> Here </a>", createEntityCommand.ApprovalApproverEmail, "", "New Approval Request ", "dev@wallop.in", null);

                isSent =  await _emailService.SendEmail(objEmailInfo);

                if (isSent)
                {
                    return Ok(response);
                }
                else
                {
                    response.Message = "Record was created Error Send Email";
                    return Ok(response);
                }

            }
            {
                response.Message = "Error creating the record";
                return BadRequest(response);


            }

        }


        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UpdateApprovalApproverCommandResponse>> PutApprovalApprover([FromBody] UpdateApprovalApproverCommand updateEntityCommand)
        {
            var response = await _mediator.Send(updateEntityCommand);

            if (response.Success)
            {
                if (response.Approval.ApprovalStatusId == "ApprvlStatus_2025_03_174b8f22bc-6930-47db-b737-672e3177a851")
                {
                    if (response.Approval.ApprovalType == "Letter")
                    {

                    }
                    else if (response.Approval.ApprovalType == "FinanceExpense")
                    {

                        //string contentRootPath = _webHostEnvironment.ContentRootPath;

                        //string pathUploadedFiles = Path.Combine(contentRootPath, "Content", "Uploads");

                        //string pathDocuments = Path.Combine(contentRootPath, "Documents");

                        //// string directoryName = Guid.NewGuid().ToString();
                        ////Make the directory name
                        //string directory = pathUploadedFiles + "/" + Guid.NewGuid().ToString();

                        ////Check if directory already exists
                        //bool ifExist = Directory.Exists(directory);
                        ////if not then create a directory
                        //if (!ifExist)
                        //{
                        //    Directory.CreateDirectory(directory);
                        //}


                        //string extension = ".pdf";

                        //string fileName = "Expense_Transaction_" + Guid.NewGuid() + extension;

                        //var file = directory + "/" + fileName;

                        ////  System.IO.File.WriteAllBytes(file, testb);

                        //long fileLenght = 0;// _pdfService.GeneratePdf(response.LetterContent, file);

                        //_pdfService.CreateExpensePdf(file, response.ExpenseTransaction );


                        //string fileNameForBlobUpload = fileName; //fileNameWOExtension + "_" + Guid.NewGuid() + extension;

                        //string blobUrl = _blobService.UploadFile(file, fileNameForBlobUpload);

                        //CreateDocumentUrlCommand createDocumentUrlCommand = new CreateDocumentUrlCommand();

                        //createDocumentUrlCommand.BlobUrl = blobUrl;

                        //createDocumentUrlCommand.Name = response.ExpenseTransaction.Name;
                        ////   createDocumentUrlCommand.Description = createLetterCommand.Notes;
                        //createDocumentUrlCommand.Content = "-";
                        //createDocumentUrlCommand.ContentType = $"application/pdf";
                        //createDocumentUrlCommand.Extension = extension;//System.IO.Path.GetExtension(objfile.FileName);
                        //createDocumentUrlCommand.Category = response.ExpenseTransaction.Category;
                        //createDocumentUrlCommand.CategoryID = response.ExpenseTransaction.CategoryId;

                        //createDocumentUrlCommand.DocumentType = "ExpenseTransaction";

                        //// createDocumentUrlCommand.DocumentType = "Letter";
                        //createDocumentUrlCommand.DocumentTypeID = response.ExpenseTransaction.ExpenseTransactionId;

                        //createDocumentUrlCommand.DocumentFileName = fileName;

                        //createDocumentUrlCommand.FileSizeBytes = fileLenght;

                        //createDocumentUrlCommand.DocumentDate = response.ExpenseTransaction.DateOfPayment;

                        ////Saving the record to DB
                        //CreateDocumentUrlCommandResponse response1 = await _mediator.Send(createDocumentUrlCommand);

                        //if (extension.ToLower() == ".pdf" || extension.ToLower() == ".doc" || extension.ToLower() == ".docx")
                        //{
                        //    OcrContent(file, directory, extension.ToLower(), response1.Data.DocumentUrlID);

                        //}
                        //else
                        //{

                        //    //Delete created files and folder 
                        //    if (Directory.Exists(directory))
                        //    {

                        //        Directory.Delete(directory, true);

                        //    }

                        //}

                    }
                    else if (response.Approval.ApprovalType == "OfficeNote")
                    {
                    }
                }

                return Ok(response);
            }
            {
                response.Message = "Error Updating the record";
                return BadRequest(response);
            }

        }


        [HttpDelete("{id}", Name = "DeleteApprovalApprover")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult<DeleteApprovalApproverCommandResponse>> Delete(string id)
        {
            var deleteEntityCommand = new DeleteApprovalApproverCommand() { ApprovalApproverID = id };
            var response = await _mediator.Send(deleteEntityCommand);


            if (response.Success)
            {
                return Ok(response);
            }
            {
                return BadRequest(response);
            }
        }


      

        private string GetValidEmails(string emails)
        {
            // Split the input string by commas to get an array of emails
            string[] emailArray = emails.Split(',');

            // Create a list to store valid emails
            List<string> validEmails = new List<string>();

            // Regular expression to validate email format
            string emailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            Regex emailRegex = new Regex(emailPattern);

            foreach (var email in emailArray)
            {
                // Trim any leading/trailing whitespace
                string trimmedEmail = email.Trim();

                // Validate if the email matches the pattern
                if (emailRegex.IsMatch(trimmedEmail))
                {
                    validEmails.Add(trimmedEmail);
                }
            }

            // Return the valid emails as a comma-separated string
            return string.Join(",", validEmails);
        }



    }
}
