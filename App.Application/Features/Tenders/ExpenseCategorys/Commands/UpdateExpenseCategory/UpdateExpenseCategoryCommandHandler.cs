using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.UpdateExpenseCategory
{
    public class UpdateExpenseCategoryCommandHandler : IRequestHandler<UpdateExpenseCategoryCommand, UpdateExpenseCategoryCommandResponse>
    {
        private readonly IExpenseCategoryRepository _ExpenseCategoryRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateExpenseCategoryCommandHandler(IMapper mapper, IExpenseCategoryRepository ExpenseCategoryRepository)
        {
            _mapper = mapper;
            _ExpenseCategoryRepository = ExpenseCategoryRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateExpenseCategoryCommandResponse> Handle(UpdateExpenseCategoryCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _ExpenseCategoryRepository.GetByIdAsync(request.ExpenseCategoryId);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(ExpenseCategory), request.ExpenseCategoryId);
            }



            var updateExpenseCategoryCommandResponse = new UpdateExpenseCategoryCommandResponse();

            var validator = new UpdateExpenseCategoryCommandValidator(_ExpenseCategoryRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateExpenseCategoryCommandResponse.Success = false;
                updateExpenseCategoryCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateExpenseCategoryCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateExpenseCategoryCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateExpenseCategoryCommand), typeof(ExpenseCategory));

           
                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _ExpenseCategoryRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateExpenseCategoryCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    updateExpenseCategoryCommandResponse.Data = _mapper.Map<UpdateExpenseCategoryDto>(recordToUpdate);

                }

            }


            return updateExpenseCategoryCommandResponse;



        }

    }
}
