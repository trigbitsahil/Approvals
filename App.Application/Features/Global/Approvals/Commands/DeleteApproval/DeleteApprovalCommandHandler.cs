using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Approvals.Commands.DeleteApproval
{
    public class DeleteApprovalCommandHandler :
       IRequestHandler<DeleteApprovalCommand, DeleteApprovalCommandResponse>
    {
        private readonly IApprovalRepository _ApprovalRepository;


        private readonly IMapper _mapper;
        public DeleteApprovalCommandHandler(IMapper mapper, IApprovalRepository ApprovalRepository)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
        }



        public async Task<DeleteApprovalCommandResponse> Handle(DeleteApprovalCommand request, CancellationToken cancellationToken)
        {

            DeleteApprovalCommandResponse deleteApprovalCommandResponse = new DeleteApprovalCommandResponse();

            var validator = new DeleteApprovalCommandValidator(_ApprovalRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteApprovalCommandResponse.Success = false;
                deleteApprovalCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteApprovalCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteApprovalCommandResponse.Success)
            {

                Approval entity = await _ApprovalRepository.GetByIdAsync(request.ApprovalID);

                int result;


                if (entity == null)
                {
                    deleteApprovalCommandResponse.Success = false;

                    deleteApprovalCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _ApprovalRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteApprovalCommandResponse.Success = false;

                        deleteApprovalCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteApprovalCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteApprovalCommandResponse;



        }


    }
}
