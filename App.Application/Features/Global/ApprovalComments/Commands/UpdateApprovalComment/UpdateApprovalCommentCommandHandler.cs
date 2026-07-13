using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.UpdateApprovalComment
{
    public class UpdateApprovalCommentCommandHandler : IRequestHandler<UpdateApprovalCommentCommand, UpdateApprovalCommentCommandResponse>
    {
        private readonly IApprovalCommentRepository _ApprovalCommentRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateApprovalCommentCommandHandler(IMapper mapper, IApprovalCommentRepository ApprovalCommentRepository)
        {
            _mapper = mapper;
            _ApprovalCommentRepository = ApprovalCommentRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateApprovalCommentCommandResponse> Handle(UpdateApprovalCommentCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _ApprovalCommentRepository.GetByIdAsync(request.ApprovalCommentId);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(ApprovalComment), request.ApprovalCommentId);
            }



            var updateApprovalCommentCommandResponse = new UpdateApprovalCommentCommandResponse();

            var validator = new UpdateApprovalCommentCommandValidator(_ApprovalCommentRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateApprovalCommentCommandResponse.Success = false;
                updateApprovalCommentCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateApprovalCommentCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateApprovalCommentCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateApprovalCommentCommand), typeof(ApprovalComment));

           
                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _ApprovalCommentRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateApprovalCommentCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    updateApprovalCommentCommandResponse.Data = _mapper.Map<UpdateApprovalCommentDto>(recordToUpdate);

                }

            }


            return updateApprovalCommentCommandResponse;



        }

    }
}
