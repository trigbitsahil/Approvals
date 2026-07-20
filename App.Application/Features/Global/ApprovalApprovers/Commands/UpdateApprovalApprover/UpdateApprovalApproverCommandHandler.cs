using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Exceptions;
using OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverList;
//using OOH.Application.Features.Tenders.Documents.Commands.CreateDocumentUrl;
 
using OOH.Application.Models.Mail;
using OOH.Domain;
using OOH.Domain.Entities.Global;
using OOH.Domain.Entities.Tenders;
using System.ComponentModel.Design;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
using System.Xml.Serialization;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.UpdateApprovalApprover
{
    public class UpdateApprovalApproverCommandHandler : IRequestHandler<UpdateApprovalApproverCommand, UpdateApprovalApproverCommandResponse>
    {

     

        private readonly IApprovalApproverRepository _ApprovalApproverRepository;

        private readonly IMapper _mapper;

        private readonly IApprovalRepository _approvalRepository;
        private readonly IBankRepository _bankRepository;
        private readonly IBankTransactionRepository _bankTransactionRepository;

        //private readonly IDocumentUrlRepository _documentUrlRepository;

        //private readonly IExpenseTransactionRepository _expenseTransactionRepository;








        //  private readonly ILetterRepository _letterRepository;

        private readonly IEmailService _emailService;

        public UpdateApprovalApproverCommandHandler(IMapper mapper, IApprovalApproverRepository ApprovalApproverRepository, 
            IApprovalRepository approvalRepository, 
             IEmailService emailService,
             IBankRepository bankRepository,
             IBankTransactionRepository bankTransactionRepository
            // IDocumentUrlRepository documentUrlRepository,
            //IExpenseTransactionRepository expenseTransactionRepository 
 
            )
        {
            _mapper = mapper;
            _ApprovalApproverRepository = ApprovalApproverRepository;
            _approvalRepository = approvalRepository;
            _bankRepository = bankRepository;
            _bankTransactionRepository = bankTransactionRepository;
        
            _emailService = emailService;
         
            //_documentUrlRepository = documentUrlRepository;
            //_expenseTransactionRepository = expenseTransactionRepository;
      
        }




        public async Task<UpdateApprovalApproverCommandResponse> Handle(UpdateApprovalApproverCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _ApprovalApproverRepository.GetByIdAsync(request.ApprovalApproverID);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(ApprovalApprover), request.ApprovalApproverID);
            }


            var updateApprovalApproverCommandResponse = new UpdateApprovalApproverCommandResponse();

            var validator = new UpdateApprovalApproverCommandValidator(_ApprovalApproverRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateApprovalApproverCommandResponse.Success = false;
                updateApprovalApproverCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateApprovalApproverCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateApprovalApproverCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateApprovalApproverCommand), typeof(ApprovalApprover));


                // await _eventRepository.UpdateAsync(eventToUpdate);

                int i = await _ApprovalApproverRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateApprovalApproverCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    List<ApprovalApproverListVM> entitylist = await _ApprovalApproverRepository.ListAllApprovalApproversAsync(request.ApprovalId);

                    Approval objApproval = new Approval();


                    objApproval = await _approvalRepository.GetByIdAsync(recordToUpdate.ApprovalId);


                    string toCCEmails = string.Empty;


                    foreach (var entity in entitylist)
                    {
                        if (string.IsNullOrEmpty(toCCEmails))
                        {

                            toCCEmails = entity.ApprovalApproverEmail;

                        }
                        else
                        { 
                        
                        toCCEmails = toCCEmails + "," + entity.ApprovalApproverEmail;

                        }
                    }

                    bool isApproved = false;
                    bool isRejected = false;

                    var masterApproval = entitylist.Where(x => x.IsMasterApprover == true).FirstOrDefault();

                    if (masterApproval != null && masterApproval.IsResponded)
                    {
                        if (masterApproval.IsApproved)
                        {
                            isApproved = masterApproval.IsApproved;

                        }
                        else
                        {

                            isRejected = true;
                        }
                    }
                    else
                    {

                        if (objApproval.AllApproverApprove)
                        {
                            int approvedCounter = 0;
                            int rejectedCounter = 0;

                            foreach (var entity in entitylist)
                            {
                               
                                if (entity.IsResponded)
                                {
                                    if (entity.IsApproved)
                                    {
                                        approvedCounter++;
                                    }
                                    else {
                                        rejectedCounter++;


                                    }


                                }

                            }

                            if (approvedCounter == entitylist.Count())
                            {

                                isApproved = true;
                            }
                            else if (rejectedCounter > 0 )  //Any one rejected 
                            {

                                isRejected = true;
                            }


                        }
                        else
                        {

                            foreach (var entity in entitylist)
                            {
                                if (entity.IsResponded && entity.IsApproved)
                                {
                                    isApproved = true;
                                    break;

                                }
                                else if (entity.IsResponded && !entity.IsApproved)
                                {
                                    isRejected = true;
                                    break;

                                }

                            }


                        }

                    }

                    if (isApproved)
                    {

                        objApproval.ApprovalStatusId = "ApprvlStatus_2025_03_174b8f22bc-6930-47db-b737-672e3177a851";

                        int i1 = await _approvalRepository.UpdateAsync(objApproval);

                        if (!string.IsNullOrEmpty(objApproval.FromBankId) && !string.IsNullOrEmpty(objApproval.ToBankId) && objApproval.TransactionAmount.HasValue && objApproval.TransactionAmount > 0)
                        {
                            var fromBank = await _bankRepository.GetByIdAsync(objApproval.FromBankId);
                            var toBank = await _bankRepository.GetByIdAsync(objApproval.ToBankId);

                            if (fromBank != null && toBank != null)
                            {
                                var transaction = new BankTransaction
                                {
                                    TransactionId = "Txn_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                                    FromBankId = fromBank.BankId,
                                    ToBankId = toBank.BankId,
                                    ApprovalId = objApproval.ApprovalId,
                                    TransactionType = "Transfer",
                                    Amount = objApproval.TransactionAmount.Value,
                                    Withdrawal = objApproval.TransactionAmount.Value,
                                    Deposit = objApproval.TransactionAmount.Value,
                                    RunningBalance = 0, // Calculated dynamically on read
                                    CreatedBy = "System",
                                    CreatedDate = DateTime.UtcNow,
                                    TenantId = objApproval.TenantId,
                                    VendorId = objApproval.VendorId
                                };
                                await _bankTransactionRepository.AddAsync(transaction);
                            }
                        }


                        updateApprovalApproverCommandResponse.Approval = objApproval;

                        if (objApproval.ApprovalType == "Letter")
                        { 

                        }



                       else if (objApproval.ApprovalType == "Expense")
                        {
                            //ExpenseTransaction objExpenseTransaction = await _expenseTransactionRepository.GetByIdAsync(objApproval.ApprovalTypeId);

                            //objExpenseTransaction.IsApproved = true;
                            //objExpenseTransaction.ApprovalId = objApproval.ApprovalId;
                            //objExpenseTransaction.ApprovedDate = DateTime.Now.Date;
                            //objExpenseTransaction.ApprovedBy = recordToUpdate.ApprovalApproverEmail;
                            //await _expenseTransactionRepository.UpdateAsync(objExpenseTransaction);

                            //updateApprovalApproverCommandResponse.ExpenseTransaction = objExpenseTransaction;

                      
                            //ferch all users from finanance department and sed email about
                        }

                        else if (objApproval.ApprovalType == "OfficeNote")
                        {
                             


                            //fetch all users from finanance department and sed email abou
                        }
                        else if (objApproval.ApprovalType == "FinanceExpense")
                        {

                            //ExpenseTransaction objExpenseTransaction = await _expenseTransactionRepository.GetByIdAsync(objApproval.ApprovalTypeId);

                            //objExpenseTransaction.IsFinanceApproved = true;
                            //objExpenseTransaction.FinanceApprovalId = objApproval.ApprovalId;
                            //objExpenseTransaction.FinanceApprovedDate = DateTime.Now.Date;
                            //objExpenseTransaction.FinanceApprovedBy = recordToUpdate.ApprovalApproverEmail;

                            //await _expenseTransactionRepository.UpdateAsync(objExpenseTransaction);
                            //updateApprovalApproverCommandResponse.ExpenseTransaction = objExpenseTransaction;

                        }
                    }
                    else if (isRejected)
                    {

                        objApproval.ApprovalStatusId = "ApprvlStatus_2025_03_17d17599ad-51d4-4b5f-8b97-affb3bf9bbda";

                        int i1 = await _approvalRepository.UpdateAsync(objApproval);

                    }


                    string approvedOrRejected = (recordToUpdate.IsResponded && recordToUpdate.IsApproved) ? "Approved" : "Rejected";
                    string currentStatus = (isApproved) ? "Approved" : ((isRejected) ? "Rejected" : "Pending");

                    EmailInfo email = new EmailInfo($"Hi,{recordToUpdate.ApprovalApproverEmail} has {approvedOrRejected} the  approval {objApproval.Name} . The status of approval after the response is  {currentStatus}",
                      objApproval.RequestedBy, null, $"Approval {objApproval.Name} Updated", "dev@wallop.in", null, toCCEmails
                      );

                     bool isSent = await _emailService.SendEmail(email);

                     updateApprovalApproverCommandResponse.Data = _mapper.Map<UpdateApprovalApproverDto>(recordToUpdate);

                }



            }


            return updateApprovalApproverCommandResponse;



        }

    }
}
