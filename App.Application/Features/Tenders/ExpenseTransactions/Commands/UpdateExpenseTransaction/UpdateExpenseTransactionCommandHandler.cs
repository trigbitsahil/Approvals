using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.UpdateExpenseTransaction
{
    public class UpdateExpenseTransactionCommandHandler : IRequestHandler<UpdateExpenseTransactionCommand, UpdateExpenseTransactionCommandResponse>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateExpenseTransactionCommandHandler(IMapper mapper, IExpenseTransactionRepository ExpenseTransactionRepository)
        {
            _mapper = mapper;
            _ExpenseTransactionRepository = ExpenseTransactionRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateExpenseTransactionCommandResponse> Handle(UpdateExpenseTransactionCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _ExpenseTransactionRepository.GetByIdAsync(request.ExpenseTransactionID);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(ExpenseTransaction), request.ExpenseTransactionID);
            }



            var updateExpenseTransactionCommandResponse = new UpdateExpenseTransactionCommandResponse();

            var validator = new UpdateExpenseTransactionCommandValidator(_ExpenseTransactionRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateExpenseTransactionCommandResponse.Success = false;
                updateExpenseTransactionCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateExpenseTransactionCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateExpenseTransactionCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateExpenseTransactionCommand), typeof(ExpenseTransaction));

           
                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _ExpenseTransactionRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateExpenseTransactionCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else if (recordToUpdate.IsCleared && recordToUpdate.DateOfPayment != null)
                {
                    updateExpenseTransactionCommandResponse.Data = _mapper.Map<UpdateExpenseTransactionDto>(recordToUpdate);
                    int d = await _ExpenseTransactionRepository.UpdateRelatedDocumentDate("ExpenseTransaction", recordToUpdate.ExpenseTransactionId, Convert.ToDateTime( recordToUpdate.DateOfPayment));


                }
                else
                {
                    updateExpenseTransactionCommandResponse.Data = _mapper.Map<UpdateExpenseTransactionDto>(recordToUpdate);
                    int d = await _ExpenseTransactionRepository.UpdateRelatedDocumentDate("ExpenseTransaction", recordToUpdate.ExpenseTransactionId, recordToUpdate.DateOfExpense);

                }

            }


            return updateExpenseTransactionCommandResponse;



        }

    }
}
