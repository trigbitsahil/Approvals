using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.CreateApprovalApprover
{
    public class CreateApprovalApproverCommandHandler : IRequestHandler<CreateApprovalApproverCommand, CreateApprovalApproverCommandResponse>
    {
        private readonly IApprovalApproverRepository _ApprovalApproverRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IPushNotificationService _pushNotificationService;
        private readonly IEncryptionService _encryptionService;

        public CreateApprovalApproverCommandHandler(
            IMapper mapper, 
            IApprovalApproverRepository ApprovalApproverRepository, 
            IApprovalRepository approvalRepository,
            IEmailService emailService, 
            IPushNotificationService pushNotificationService,
            IEncryptionService encryptionService)
        {
            _mapper = mapper;
            _ApprovalApproverRepository = ApprovalApproverRepository;
            _approvalRepository = approvalRepository;
            _emailService = emailService;
            _pushNotificationService = pushNotificationService;
            _encryptionService = encryptionService;
        }




        public async Task<CreateApprovalApproverCommandResponse> Handle(CreateApprovalApproverCommand request, CancellationToken cancellationToken)
        {

            var createApprovalApproverCommandResponse = new CreateApprovalApproverCommandResponse();

            var validator = new CreateApprovalApproverCommandValidator(_ApprovalApproverRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createApprovalApproverCommandResponse.Success = false;
                createApprovalApproverCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createApprovalApproverCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createApprovalApproverCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.ApprovalApprover, DateTime.Now, System.Guid.NewGuid().ToString());




                ApprovalApprover entity = _mapper.Map<ApprovalApprover>(request);


                entity.ApprovalId = request.ApprovalID;
                entity.ApprovalApproverId = entityKeyColumnValue;
 


                int i = await _ApprovalApproverRepository.AddAsync(entity);

                if (i == -1)
                {
                    createApprovalApproverCommandResponse.Success = false;

                }
                else
                {
                    createApprovalApproverCommandResponse.Data = _mapper.Map<CreateApprovalApproverDto>(entity);
                    try
                    {
                        var approval = await _approvalRepository.GetByIdAsync(request.ApprovalID);
                        string approvalName = (approval != null && !string.IsNullOrEmpty(approval.Name)) 
                            ? _encryptionService.Decrypt(approval.Name) 
                            : "a new request";
                        
                        Console.WriteLine($"[CreateApprovalApproverCommandHandler] Attempting to send push notification to {entity.ApprovalApproverEmail}");
                        await _pushNotificationService.SendNotificationAsync(
                            entity.ApprovalApproverEmail,
                            "New Approval Request",
                            $"You have been assigned as an approver for '{approvalName}'."
                        );
                        Console.WriteLine($"[CreateApprovalApproverCommandHandler] Successfully invoked SendNotificationAsync");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[CreateApprovalApproverCommandHandler] Error sending push notification: {ex.Message}\n{ex.StackTrace}");
                    }
                }

            }


            return createApprovalApproverCommandResponse;



        }


    }
}
