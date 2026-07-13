using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalStatuss.Commands.UpdateApprovalStatus
{
    public class UpdateApprovalStatusCommandHandler : IRequestHandler<UpdateApprovalStatusCommand, UpdateApprovalStatusCommandResponse>
    {
        private readonly IApprovalStatusRepository _ApprovalStatusRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateApprovalStatusCommandHandler(IMapper mapper, IApprovalStatusRepository ApprovalStatusRepository)
        {
            _mapper = mapper;
            _ApprovalStatusRepository = ApprovalStatusRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateApprovalStatusCommandResponse> Handle(UpdateApprovalStatusCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _ApprovalStatusRepository.GetByIdAsync(request.ApprovalStatusID);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(ApprovalStatus), request.ApprovalStatusID);
            }



            var updateApprovalStatusCommandResponse = new UpdateApprovalStatusCommandResponse();

            var validator = new UpdateApprovalStatusCommandValidator(_ApprovalStatusRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateApprovalStatusCommandResponse.Success = false;
                updateApprovalStatusCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateApprovalStatusCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateApprovalStatusCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateApprovalStatusCommand), typeof(ApprovalStatus));

           
                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _ApprovalStatusRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateApprovalStatusCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    updateApprovalStatusCommandResponse.Data = _mapper.Map<UpdateApprovalStatusDto>(recordToUpdate);

                }

            }


            return updateApprovalStatusCommandResponse;



        }

    }
}
