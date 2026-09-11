using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain;
using OOH.Domain.Entities.Global;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Approvals.Commands.CreateApproval
{
    public class CreateApprovalCommandHandler : IRequestHandler<CreateApprovalCommand, CreateApprovalCommandResponse>
    {
        private readonly IApprovalRepository _ApprovalRepository;
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly ILoggedInUserService _loggedInUserService;
        private readonly IEncryptionService _encryptionService;
        private readonly IApprovalHistoryRepository _historyRepository;

        public CreateApprovalCommandHandler(
            IMapper mapper, 
            IApprovalRepository ApprovalRepository, 
            IBankTransactionRepository bankTransactionRepository,
            IEmailService emailService, 
            ILoggedInUserService loggedInUserService, 
            IEncryptionService encryptionService,
            IApprovalHistoryRepository historyRepository = null)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
            _bankTransactionRepository = bankTransactionRepository;
            _emailService = emailService;
            _loggedInUserService = loggedInUserService; 
            _encryptionService = encryptionService;
            _historyRepository = historyRepository;
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

                var rawName = request.Name;

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
                    createApprovalCommandResponse.Data = _mapper.Map<CreateApprovalDto>(entity);

                    if (_historyRepository != null)
                    {
                        await _historyRepository.LogHistoryAsync(
                            entityKeyColumnValue,
                            "Approval Created",
                            $"Approval request '{rawName}' submitted by {_loggedInUserService.UserEmail}.",
                            _loggedInUserService.UserEmail,
                            _loggedInUserService.UserEmail
                        );
                    }
                }
            }

            return createApprovalCommandResponse;
        }
    }
}
