using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.DeleteApprovalApprover
{
    public class DeleteApprovalApproverCommandHandler :
       IRequestHandler<DeleteApprovalApproverCommand, DeleteApprovalApproverCommandResponse>
    {
        private readonly IApprovalApproverRepository _ApprovalApproverRepository;


        private readonly IMapper _mapper;
        public DeleteApprovalApproverCommandHandler(IMapper mapper, IApprovalApproverRepository ApprovalApproverRepository)
        {
            _mapper = mapper;
            _ApprovalApproverRepository = ApprovalApproverRepository;
        }



        public async Task<DeleteApprovalApproverCommandResponse> Handle(DeleteApprovalApproverCommand request, CancellationToken cancellationToken)
        {

            DeleteApprovalApproverCommandResponse deleteApprovalApproverCommandResponse = new DeleteApprovalApproverCommandResponse();

            var validator = new DeleteApprovalApproverCommandValidator(_ApprovalApproverRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteApprovalApproverCommandResponse.Success = false;
                deleteApprovalApproverCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteApprovalApproverCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteApprovalApproverCommandResponse.Success)
            {

                ApprovalApprover entity = await _ApprovalApproverRepository.GetByIdAsync(request.ApprovalApproverID);

                int result;


                if (entity == null)
                {
                    deleteApprovalApproverCommandResponse.Success = false;

                    deleteApprovalApproverCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _ApprovalApproverRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteApprovalApproverCommandResponse.Success = false;

                        deleteApprovalApproverCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteApprovalApproverCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteApprovalApproverCommandResponse;



        }


    }
}
