using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalStatuss.Commands.DeleteApprovalStatus
{
    public class DeleteApprovalStatusCommandHandler :
       IRequestHandler<DeleteApprovalStatusCommand, DeleteApprovalStatusCommandResponse>
    {
        private readonly IApprovalStatusRepository _ApprovalStatusRepository;


        private readonly IMapper _mapper;
        public DeleteApprovalStatusCommandHandler(IMapper mapper, IApprovalStatusRepository ApprovalStatusRepository)
        {
            _mapper = mapper;
            _ApprovalStatusRepository = ApprovalStatusRepository;
        }



        public async Task<DeleteApprovalStatusCommandResponse> Handle(DeleteApprovalStatusCommand request, CancellationToken cancellationToken)
        {

            DeleteApprovalStatusCommandResponse deleteApprovalStatusCommandResponse = new DeleteApprovalStatusCommandResponse();

            var validator = new DeleteApprovalStatusCommandValidator(_ApprovalStatusRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteApprovalStatusCommandResponse.Success = false;
                deleteApprovalStatusCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteApprovalStatusCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteApprovalStatusCommandResponse.Success)
            {

                ApprovalStatus entity = await _ApprovalStatusRepository.GetByIdAsync(request.ApprovalStatusID);

                int result;


                if (entity == null)
                {
                    deleteApprovalStatusCommandResponse.Success = false;

                    deleteApprovalStatusCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _ApprovalStatusRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteApprovalStatusCommandResponse.Success = false;

                        deleteApprovalStatusCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteApprovalStatusCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteApprovalStatusCommandResponse;



        }


    }
}
