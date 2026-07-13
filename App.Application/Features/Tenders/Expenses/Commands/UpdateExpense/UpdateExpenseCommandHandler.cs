using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Expenses.Commands.UpdateExpense
{
    public class UpdateExpenseCommandHandler : IRequestHandler<UpdateExpenseCommand, UpdateExpenseCommandResponse>
    {
        private readonly IExpenseRepository _ExpenseRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateExpenseCommandHandler(IMapper mapper, IExpenseRepository ExpenseRepository)
        {
            _mapper = mapper;
            _ExpenseRepository = ExpenseRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateExpenseCommandResponse> Handle(UpdateExpenseCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _ExpenseRepository.GetByIdAsync(request.ExpenseID);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(Expense), request.ExpenseID);
            }



            var updateExpenseCommandResponse = new UpdateExpenseCommandResponse();

            var validator = new UpdateExpenseCommandValidator(_ExpenseRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateExpenseCommandResponse.Success = false;
                updateExpenseCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateExpenseCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateExpenseCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateExpenseCommand), typeof(Expense));

           
                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _ExpenseRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateExpenseCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    updateExpenseCommandResponse.Data = _mapper.Map<UpdateExpenseDto>(recordToUpdate);

                }

            }


            return updateExpenseCommandResponse;



        }

    }
}
