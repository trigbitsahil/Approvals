using AutoMapper;
using MediatR;
using System.Linq;
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
        private readonly IEncryptionService _encryptionService;

        //private readonly IDocumentUrlRepository _documentUrlRepository;

        //private readonly IExpenseTransactionRepository _expenseTransactionRepository;








        //  private readonly ILetterRepository _letterRepository;

        private readonly IEmailService _emailService;
        private readonly IPushNotificationService _pushNotificationService;
        private readonly ILoggedInUserService _loggedInUserService;
        private readonly IApprovalHistoryRepository _historyRepository;

        public UpdateApprovalApproverCommandHandler(IMapper mapper, IApprovalApproverRepository ApprovalApproverRepository, 
            IApprovalRepository approvalRepository, 
             IEmailService emailService,
             IBankRepository bankRepository,
             IBankTransactionRepository bankTransactionRepository,
             IEncryptionService encryptionService,
             IPushNotificationService pushNotificationService,
             ILoggedInUserService loggedInUserService = null,
             IApprovalHistoryRepository historyRepository = null
            )
        {
            _mapper = mapper;
            _ApprovalApproverRepository = ApprovalApproverRepository;
            _approvalRepository = approvalRepository;
            _bankRepository = bankRepository;
            _bankTransactionRepository = bankTransactionRepository;
            _encryptionService = encryptionService;
        
            _emailService = emailService;
            _pushNotificationService = pushNotificationService;
            _loggedInUserService = loggedInUserService;
            _historyRepository = historyRepository;
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
                    if (_historyRepository != null)
                    {
                        var statusAction = recordToUpdate.IsApproved ? "Approved" : "Rejected";
                        var approverUser = recordToUpdate.ApprovalApproverEmail ?? _loggedInUserService?.UserEmail ?? "Approver";
                        await _historyRepository.LogHistoryAsync(
                            recordToUpdate.ApprovalId,
                            statusAction,
                            $"Approval request {statusAction.ToLower()} by {approverUser}.",
                            approverUser,
                            approverUser.Split('@')[0],
                            recordToUpdate.Remarks
                        );
                    }

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

                        // Create Pending Bank Transaction when approval is APPROVED
                        if (objApproval.TransactionAmount.HasValue && objApproval.TransactionAmount.Value > 0)
                        {
                            var existingTxs = await _bankTransactionRepository.ListAllAsync();
                            bool alreadyExists = existingTxs.Any(t => t.ApprovalId == objApproval.ApprovalId && !t.IsVoided);

                            if (!alreadyExists)
                            {
                                string decType = !string.IsNullOrEmpty(objApproval.ApprovalType) ? _encryptionService.Decrypt(objApproval.ApprovalType) : "General";

                                if (decType == "Initial Balance")
                                {
                                    var toBank = !string.IsNullOrEmpty(objApproval.ToBankId) ? await _bankRepository.GetByIdAsync(objApproval.ToBankId) : null;
                                    var allTxs = await _bankTransactionRepository.ListAllAsync();
                                    decimal toBankBal = toBank != null
                                        ? allTxs.Where(t => (t.FromBankId == toBank.BankId || t.ToBankId == toBank.BankId) && t.IsConfirm && !t.IsVoided)
                                                .Sum(t => (t.ToBankId == toBank.BankId ? t.Deposit : 0) - (t.FromBankId == toBank.BankId ? t.Withdrawal : 0))
                                        : 0;

                                    var initialBalTx = new BankTransaction
                                    {
                                        TransactionId = "Txn_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                                        ApprovalId = objApproval.ApprovalId,
                                        FromBankId = null,
                                        ToBankId = objApproval.ToBankId,
                                        VendorId = null,
                                        DebtorId = null,
                                        DistributorId = null,
                                        TransactionType = "Deposit",
                                        Amount = objApproval.TransactionAmount.Value,
                                        Deposit = objApproval.TransactionAmount.Value,
                                        Withdrawal = 0,
                                        RunningBalance = toBankBal + objApproval.TransactionAmount.Value,
                                        IsPaidToDistributor = true,
                                        IsConfirm = true,
                                        CreatedBy = _loggedInUserService?.UserEmail ?? recordToUpdate.ApprovalApproverEmail ?? "System",
                                        CreatedDate = DateTime.UtcNow,
                                        TenantId = objApproval.TenantId ?? "TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3"
                                    };
                                    await _bankTransactionRepository.AddAsync(initialBalTx);
                                }
                                else if (!string.IsNullOrEmpty(objApproval.FromBankId) && !string.IsNullOrEmpty(objApproval.ToBankId))
                                {
                                    // Bank-to-Bank transfer: create dual pending transactions (debitTx for FromBank, creditTx for ToBank)
                                    var debitTx = new BankTransaction
                                    {
                                        TransactionId = "Txn_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                                        ApprovalId = objApproval.ApprovalId,
                                        FromBankId = objApproval.FromBankId,
                                        ToBankId = null,
                                        VendorId = objApproval.VendorId,
                                        DebtorId = objApproval.DebtorId,
                                        DistributorId = objApproval.DistributorId,
                                        TransactionType = decType,
                                        Amount = objApproval.TransactionAmount.Value,
                                        Deposit = 0,
                                        Withdrawal = 0,
                                        RunningBalance = 0,
                                        IsPaidToDistributor = false,
                                        IsConfirm = false,
                                        CreatedBy = _loggedInUserService?.UserEmail ?? recordToUpdate.ApprovalApproverEmail ?? "System",
                                        CreatedDate = DateTime.UtcNow,
                                        TenantId = objApproval.TenantId ?? "TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3"
                                    };
                                    await _bankTransactionRepository.AddAsync(debitTx);

                                    var creditTx = new BankTransaction
                                    {
                                        TransactionId = "Txn_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                                        ApprovalId = objApproval.ApprovalId,
                                        FromBankId = null,
                                        ToBankId = objApproval.ToBankId,
                                        VendorId = objApproval.VendorId,
                                        DebtorId = objApproval.DebtorId,
                                        DistributorId = objApproval.DistributorId,
                                        TransactionType = decType,
                                        Amount = objApproval.TransactionAmount.Value,
                                        Deposit = 0,
                                        Withdrawal = 0,
                                        RunningBalance = 0,
                                        IsPaidToDistributor = false,
                                        IsConfirm = false,
                                        CreatedBy = _loggedInUserService?.UserEmail ?? recordToUpdate.ApprovalApproverEmail ?? "System",
                                        CreatedDate = DateTime.UtcNow,
                                        TenantId = objApproval.TenantId ?? "TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3"
                                    };
                                    await _bankTransactionRepository.AddAsync(creditTx);
                                }
                                else
                                {
                                    var pendingTx = new BankTransaction
                                    {
                                        TransactionId = "Txn_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                                        ApprovalId = objApproval.ApprovalId,
                                        FromBankId = objApproval.FromBankId,
                                        ToBankId = objApproval.ToBankId,
                                        VendorId = objApproval.VendorId,
                                        DebtorId = objApproval.DebtorId,
                                        DistributorId = objApproval.DistributorId,
                                        TransactionType = decType,
                                        Amount = objApproval.TransactionAmount.Value,
                                        Deposit = 0,
                                        Withdrawal = 0,
                                        RunningBalance = 0,
                                        IsPaidToDistributor = false,
                                        IsConfirm = false,
                                        CreatedBy = _loggedInUserService?.UserEmail ?? recordToUpdate.ApprovalApproverEmail ?? "System",
                                        CreatedDate = DateTime.UtcNow,
                                        TenantId = objApproval.TenantId ?? "TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3"
                                    };
                                    await _bankTransactionRepository.AddAsync(pendingTx);
                                }
                            }
                        }

                        if (!string.IsNullOrEmpty(objApproval.RequestedBy))
                        {
                            try
                            {
                                string decryptedApprovalName = !string.IsNullOrEmpty(objApproval.Name) ? _encryptionService.Decrypt(objApproval.Name) : "Approval Request";
                                string pushTitle = "Approval Approved";
                                string pushBody = $"Your approval '{decryptedApprovalName}' has been approved and added to pending transactions.";

                                await _pushNotificationService.SendNotificationAsync(objApproval.RequestedBy, pushTitle, pushBody);
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"[UpdateApprovalApproverCommandHandler] Error sending push notification: {ex.Message}");
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
                     
                     // Send Push Notification back to Creator
                     if (!string.IsNullOrEmpty(objApproval.RequestedBy))
                     {
                         try
                         {
                             string decryptedApprovalName = (!string.IsNullOrEmpty(objApproval.Name))
                                 ? _encryptionService.Decrypt(objApproval.Name)
                                 : "Approval Request";

                             string pushTitle = $"Approval {approvedOrRejected}";
                             string pushBody = $"{recordToUpdate.ApprovalApproverEmail} has {approvedOrRejected.ToLower()} '{decryptedApprovalName}'. Current status: {currentStatus}.";
                             
                             Console.WriteLine($"[UpdateApprovalApproverCommandHandler] Attempting to send push notification to creator: {objApproval.RequestedBy}");
                             await _pushNotificationService.SendNotificationAsync(objApproval.RequestedBy, pushTitle, pushBody);
                             Console.WriteLine($"[UpdateApprovalApproverCommandHandler] Successfully invoked SendNotificationAsync for creator");
                         }
                         catch (Exception ex)
                         {
                             Console.WriteLine($"[UpdateApprovalApproverCommandHandler] Error sending push notification: {ex.Message}\n{ex.StackTrace}");
                         }
                     }

                     updateApprovalApproverCommandResponse.Data = _mapper.Map<UpdateApprovalApproverDto>(recordToUpdate);

                }



            }


            return updateApprovalApproverCommandResponse;



        }

    }
}
