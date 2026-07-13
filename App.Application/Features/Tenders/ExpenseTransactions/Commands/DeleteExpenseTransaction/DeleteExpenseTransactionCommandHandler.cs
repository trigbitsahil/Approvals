using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.DeleteExpenseTransaction
{
    public class DeleteExpenseTransactionCommandHandler :
       IRequestHandler<DeleteExpenseTransactionCommand, DeleteExpenseTransactionCommandResponse>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;


        private readonly IMapper _mapper;
        public DeleteExpenseTransactionCommandHandler(IMapper mapper, IExpenseTransactionRepository ExpenseTransactionRepository)
        {
            _mapper = mapper;
            _ExpenseTransactionRepository = ExpenseTransactionRepository;
        }



        public async Task<DeleteExpenseTransactionCommandResponse> Handle(DeleteExpenseTransactionCommand request, CancellationToken cancellationToken)
        {

            DeleteExpenseTransactionCommandResponse deleteExpenseTransactionCommandResponse = new DeleteExpenseTransactionCommandResponse();

            var validator = new DeleteExpenseTransactionCommandValidator(_ExpenseTransactionRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteExpenseTransactionCommandResponse.Success = false;
                deleteExpenseTransactionCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteExpenseTransactionCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteExpenseTransactionCommandResponse.Success)
            {

                ExpenseTransaction entity = await _ExpenseTransactionRepository.GetByIdAsync(request.ExpenseTransactionID);

                int result;


                if (entity == null)
                {
                    deleteExpenseTransactionCommandResponse.Success = false;

                    deleteExpenseTransactionCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _ExpenseTransactionRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteExpenseTransactionCommandResponse.Success = false;

                        deleteExpenseTransactionCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteExpenseTransactionCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteExpenseTransactionCommandResponse;



        }


    }
}
