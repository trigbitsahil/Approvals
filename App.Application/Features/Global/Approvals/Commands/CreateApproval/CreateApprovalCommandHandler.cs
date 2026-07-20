using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Approvals.Commands.CreateApproval
{
    public class CreateApprovalCommandHandler : IRequestHandler<CreateApprovalCommand, CreateApprovalCommandResponse>
    {
        private readonly IApprovalRepository _ApprovalRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        private readonly ILoggedInUserService _loggedInUserService;
        private readonly IEncryptionService _encryptionService;

        public CreateApprovalCommandHandler(IMapper mapper, IApprovalRepository ApprovalRepository, IEmailService emailService , ILoggedInUserService loggedInUserService, IEncryptionService encryptionService)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
            _emailService = emailService;
            _loggedInUserService = loggedInUserService; 
            _encryptionService = encryptionService;
        }




        public async Task<CreateApprovalCommandResponse> Handle(CreateApprovalCommand request, CancellationToken cancellationToken)
        {

            var createApprovalCommandResponse = new CreateApprovalCommandResponse();

            var validator = new CreateApprovalCommandValidator(_ApprovalRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createApprovalCommandResponse.Success = false;
                createApprovalCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createApprovalCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createApprovalCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.Approval, DateTime.Now, System.Guid.NewGuid().ToString());

                 

                Approval entity = _mapper.Map<Approval>(request);


                entity.ApprovalId = entityKeyColumnValue;


                entity.RequestedBy = _loggedInUserService.UserEmail;
                entity.RequestedDate = DateTime.UtcNow;

                // Encrypt sensitive fields
                entity.Name = !string.IsNullOrEmpty(entity.Name) ? _encryptionService.Encrypt(entity.Name) : entity.Name;
                entity.Description = !string.IsNullOrEmpty(entity.Description) ? _encryptionService.Encrypt(entity.Description) : entity.Description;
                entity.Reference = !string.IsNullOrEmpty(entity.Reference) ? _encryptionService.Encrypt(entity.Reference) : entity.Reference;
                entity.Details = !string.IsNullOrEmpty(entity.Details) ? _encryptionService.Encrypt(entity.Details) : entity.Details;
                entity.ApprovalType = !string.IsNullOrEmpty(entity.ApprovalType) ? _encryptionService.Encrypt(entity.ApprovalType) : entity.ApprovalType;
                entity.Priority = !string.IsNullOrEmpty(entity.Priority) ? _encryptionService.Encrypt(entity.Priority) : entity.Priority;



                int i = await _ApprovalRepository.AddAsync(entity);

                if (i == -1)
                {
                    createApprovalCommandResponse.Success = false;

                }
                else
                {

                    //[To-Do]
                    //Check the type of approval using aprroval type id (or category id) and send email notification
                    //email should have the link of the type of approval 
                    //An approval page to view the request and on that have the link to the category and id
                    // once saving /updating the category or category id , 
                    // approve the type 
                    // currently expense type and letter type to be considered
                    // once approved letter should be converted to pdf 


                    createApprovalCommandResponse.Data = _mapper.Map<CreateApprovalDto>(entity);

                }

            }


            return createApprovalCommandResponse;



        }


    }
}
