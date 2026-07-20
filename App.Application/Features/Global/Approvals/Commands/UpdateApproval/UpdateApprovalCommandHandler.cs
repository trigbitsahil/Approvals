using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.Application.Features.Global.Approvals.Commands.UpdateApproval
{
    public class UpdateApprovalCommandHandler : IRequestHandler<UpdateApprovalCommand, UpdateApprovalCommandResponse>
    {
        private readonly IApprovalRepository _ApprovalRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;
        private readonly IEncryptionService _encryptionService;

        public UpdateApprovalCommandHandler(IMapper mapper, IApprovalRepository ApprovalRepository, IEncryptionService encryptionService)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
            // _emailService = emailService;
            _encryptionService = encryptionService;
        }




        public async Task<UpdateApprovalCommandResponse> Handle(UpdateApprovalCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _ApprovalRepository.GetByIdForUpdateAsync(request.ApprovalID);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(Approval), request.ApprovalID);
            }



            var updateApprovalCommandResponse = new UpdateApprovalCommandResponse();

            var validator = new UpdateApprovalCommandValidator(_ApprovalRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateApprovalCommandResponse.Success = false;
                updateApprovalCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateApprovalCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateApprovalCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateApprovalCommand), typeof(Approval));

                // Encrypt sensitive fields
                recordToUpdate.Name = !string.IsNullOrEmpty(recordToUpdate.Name) ? _encryptionService.Encrypt(recordToUpdate.Name) : recordToUpdate.Name;
                recordToUpdate.Description = !string.IsNullOrEmpty(recordToUpdate.Description) ? _encryptionService.Encrypt(recordToUpdate.Description) : recordToUpdate.Description;
                recordToUpdate.Reference = !string.IsNullOrEmpty(recordToUpdate.Reference) ? _encryptionService.Encrypt(recordToUpdate.Reference) : recordToUpdate.Reference;
                recordToUpdate.Details = !string.IsNullOrEmpty(recordToUpdate.Details) ? _encryptionService.Encrypt(recordToUpdate.Details) : recordToUpdate.Details;
                recordToUpdate.ApprovalType = !string.IsNullOrEmpty(recordToUpdate.ApprovalType) ? _encryptionService.Encrypt(recordToUpdate.ApprovalType) : recordToUpdate.ApprovalType;
                recordToUpdate.Priority = !string.IsNullOrEmpty(recordToUpdate.Priority) ? _encryptionService.Encrypt(recordToUpdate.Priority) : recordToUpdate.Priority;

                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _ApprovalRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateApprovalCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    updateApprovalCommandResponse.Data = _mapper.Map<UpdateApprovalDto>(recordToUpdate);

                }

            }


            return updateApprovalCommandResponse;



        }

    }
}
