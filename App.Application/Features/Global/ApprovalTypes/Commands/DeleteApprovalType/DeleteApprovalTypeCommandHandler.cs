using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalTypes.Commands.DeleteApprovalType
{
    public class DeleteApprovalTypeCommandHandler :
       IRequestHandler<DeleteApprovalTypeCommand, DeleteApprovalTypeCommandResponse>
    {
        private readonly IApprovalTypeRepository _ApprovalTypeRepository;


        private readonly IMapper _mapper;
        public DeleteApprovalTypeCommandHandler(IMapper mapper, IApprovalTypeRepository ApprovalTypeRepository)
        {
            _mapper = mapper;
            _ApprovalTypeRepository = ApprovalTypeRepository;
        }



        public async Task<DeleteApprovalTypeCommandResponse> Handle(DeleteApprovalTypeCommand request, CancellationToken cancellationToken)
        {

            DeleteApprovalTypeCommandResponse deleteApprovalTypeCommandResponse = new DeleteApprovalTypeCommandResponse();

            var validator = new DeleteApprovalTypeCommandValidator(_ApprovalTypeRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteApprovalTypeCommandResponse.Success = false;
                deleteApprovalTypeCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteApprovalTypeCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteApprovalTypeCommandResponse.Success)
            {

                ApprovalType entity = await _ApprovalTypeRepository.GetByIdAsync(request.ApprovalTypeID);

                int result;


                if (entity == null)
                {
                    deleteApprovalTypeCommandResponse.Success = false;

                    deleteApprovalTypeCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _ApprovalTypeRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteApprovalTypeCommandResponse.Success = false;

                        deleteApprovalTypeCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteApprovalTypeCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteApprovalTypeCommandResponse;



        }


    }
}
