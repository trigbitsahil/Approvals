using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalTypes.Commands.UpdateApprovalType
{
    public class UpdateApprovalTypeCommandHandler : IRequestHandler<UpdateApprovalTypeCommand, UpdateApprovalTypeCommandResponse>
    {
        private readonly IApprovalTypeRepository _ApprovalTypeRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateApprovalTypeCommandHandler(IMapper mapper, IApprovalTypeRepository ApprovalTypeRepository)
        {
            _mapper = mapper;
            _ApprovalTypeRepository = ApprovalTypeRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateApprovalTypeCommandResponse> Handle(UpdateApprovalTypeCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _ApprovalTypeRepository.GetByIdAsync(request.ApprovalTypeID);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(ApprovalType), request.ApprovalTypeID);
            }



            var updateApprovalTypeCommandResponse = new UpdateApprovalTypeCommandResponse();

            var validator = new UpdateApprovalTypeCommandValidator(_ApprovalTypeRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateApprovalTypeCommandResponse.Success = false;
                updateApprovalTypeCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateApprovalTypeCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateApprovalTypeCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateApprovalTypeCommand), typeof(ApprovalType));

           
                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _ApprovalTypeRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateApprovalTypeCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    updateApprovalTypeCommandResponse.Data = _mapper.Map<UpdateApprovalTypeDto>(recordToUpdate);

                }

            }


            return updateApprovalTypeCommandResponse;



        }

    }
}
