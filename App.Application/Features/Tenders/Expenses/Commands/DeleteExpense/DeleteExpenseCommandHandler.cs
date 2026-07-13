using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Expenses.Commands.DeleteExpense
{
    public class DeleteExpenseCommandHandler :
       IRequestHandler<DeleteExpenseCommand, DeleteExpenseCommandResponse>
    {
        private readonly IExpenseRepository _ExpenseRepository;


        private readonly IMapper _mapper;
        public DeleteExpenseCommandHandler(IMapper mapper, IExpenseRepository ExpenseRepository)
        {
            _mapper = mapper;
            _ExpenseRepository = ExpenseRepository;
        }



        public async Task<DeleteExpenseCommandResponse> Handle(DeleteExpenseCommand request, CancellationToken cancellationToken)
        {

            DeleteExpenseCommandResponse deleteExpenseCommandResponse = new DeleteExpenseCommandResponse();

            var validator = new DeleteExpenseCommandValidator(_ExpenseRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteExpenseCommandResponse.Success = false;
                deleteExpenseCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteExpenseCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteExpenseCommandResponse.Success)
            {

                Expense entity = await _ExpenseRepository.GetByIdAsync(request.ExpenseID);

                int result;


                if (entity == null)
                {
                    deleteExpenseCommandResponse.Success = false;

                    deleteExpenseCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _ExpenseRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteExpenseCommandResponse.Success = false;

                        deleteExpenseCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteExpenseCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteExpenseCommandResponse;



        }


    }
}
