using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Approvals.Commands.UpdateApproval
{
    public class UpdateApprovalCommandHandler : IRequestHandler<UpdateApprovalCommand, UpdateApprovalCommandResponse>
    {
        private readonly IApprovalRepository _ApprovalRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateApprovalCommandHandler(IMapper mapper, IApprovalRepository ApprovalRepository)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateApprovalCommandResponse> Handle(UpdateApprovalCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _ApprovalRepository.GetByIdAsync(request.ApprovalID);

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
