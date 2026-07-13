using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.DeleteApprovalComment
{
    public class DeleteApprovalCommentCommandHandler :
       IRequestHandler<DeleteApprovalCommentCommand, DeleteApprovalCommentCommandResponse>
    {
        private readonly IApprovalCommentRepository _ApprovalCommentRepository;


        private readonly IMapper _mapper;
        public DeleteApprovalCommentCommandHandler(IMapper mapper, IApprovalCommentRepository ApprovalCommentRepository)
        {
            _mapper = mapper;
            _ApprovalCommentRepository = ApprovalCommentRepository;
        }



        public async Task<DeleteApprovalCommentCommandResponse> Handle(DeleteApprovalCommentCommand request, CancellationToken cancellationToken)
        {

            DeleteApprovalCommentCommandResponse deleteApprovalCommentCommandResponse = new DeleteApprovalCommentCommandResponse();

            var validator = new DeleteApprovalCommentCommandValidator(_ApprovalCommentRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteApprovalCommentCommandResponse.Success = false;
                deleteApprovalCommentCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteApprovalCommentCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteApprovalCommentCommandResponse.Success)
            {

                ApprovalComment entity = await _ApprovalCommentRepository.GetByIdAsync(request.ApprovalCommentId);

                int result;


                if (entity == null)
                {
                    deleteApprovalCommentCommandResponse.Success = false;

                    deleteApprovalCommentCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _ApprovalCommentRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteApprovalCommentCommandResponse.Success = false;

                        deleteApprovalCommentCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteApprovalCommentCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteApprovalCommentCommandResponse;



        }


    }
}
