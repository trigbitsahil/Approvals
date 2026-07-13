using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.DeleteExpenseCategory
{
    public class DeleteExpenseCategoryCommandHandler :
       IRequestHandler<DeleteExpenseCategoryCommand, DeleteExpenseCategoryCommandResponse>
    {
        private readonly IExpenseCategoryRepository _ExpenseCategoryRepository;


        private readonly IMapper _mapper;
        public DeleteExpenseCategoryCommandHandler(IMapper mapper, IExpenseCategoryRepository ExpenseCategoryRepository)
        {
            _mapper = mapper;
            _ExpenseCategoryRepository = ExpenseCategoryRepository;
        }



        public async Task<DeleteExpenseCategoryCommandResponse> Handle(DeleteExpenseCategoryCommand request, CancellationToken cancellationToken)
        {

            DeleteExpenseCategoryCommandResponse deleteExpenseCategoryCommandResponse = new DeleteExpenseCategoryCommandResponse();

            var validator = new DeleteExpenseCategoryCommandValidator(_ExpenseCategoryRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteExpenseCategoryCommandResponse.Success = false;
                deleteExpenseCategoryCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteExpenseCategoryCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteExpenseCategoryCommandResponse.Success)
            {

                ExpenseCategory entity = await _ExpenseCategoryRepository.GetByIdAsync(request.ExpenseCategoryId);

                int result;


                if (entity == null)
                {
                    deleteExpenseCategoryCommandResponse.Success = false;

                    deleteExpenseCategoryCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _ExpenseCategoryRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteExpenseCategoryCommandResponse.Success = false;

                        deleteExpenseCategoryCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteExpenseCategoryCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteExpenseCategoryCommandResponse;



        }


    }
}
