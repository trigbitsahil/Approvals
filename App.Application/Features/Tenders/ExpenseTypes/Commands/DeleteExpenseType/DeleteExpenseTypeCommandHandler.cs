using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.DeleteExpenseType
{
    public class DeleteExpenseTypeCommandHandler :
       IRequestHandler<DeleteExpenseTypeCommand, DeleteExpenseTypeCommandResponse>
    {
        private readonly IExpenseTypeRepository _ExpenseTypeRepository;


        private readonly IMapper _mapper;
        public DeleteExpenseTypeCommandHandler(IMapper mapper, IExpenseTypeRepository ExpenseTypeRepository)
        {
            _mapper = mapper;
            _ExpenseTypeRepository = ExpenseTypeRepository;
        }



        public async Task<DeleteExpenseTypeCommandResponse> Handle(DeleteExpenseTypeCommand request, CancellationToken cancellationToken)
        {

            DeleteExpenseTypeCommandResponse deleteExpenseTypeCommandResponse = new DeleteExpenseTypeCommandResponse();

            var validator = new DeleteExpenseTypeCommandValidator(_ExpenseTypeRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteExpenseTypeCommandResponse.Success = false;
                deleteExpenseTypeCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteExpenseTypeCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteExpenseTypeCommandResponse.Success)
            {

                ExpenseType entity = await _ExpenseTypeRepository.GetByIdAsync(request.ExpenseTypeID);

                int result;


                if (entity == null)
                {
                    deleteExpenseTypeCommandResponse.Success = false;

                    deleteExpenseTypeCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _ExpenseTypeRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteExpenseTypeCommandResponse.Success = false;

                        deleteExpenseTypeCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteExpenseTypeCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteExpenseTypeCommandResponse;



        }


    }
}
