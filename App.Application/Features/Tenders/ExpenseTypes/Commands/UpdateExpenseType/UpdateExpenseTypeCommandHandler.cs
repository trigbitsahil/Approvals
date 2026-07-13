using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.UpdateExpenseType
{
    public class UpdateExpenseTypeCommandHandler : IRequestHandler<UpdateExpenseTypeCommand, UpdateExpenseTypeCommandResponse>
    {
        private readonly IExpenseTypeRepository _ExpenseTypeRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateExpenseTypeCommandHandler(IMapper mapper, IExpenseTypeRepository ExpenseTypeRepository)
        {
            _mapper = mapper;
            _ExpenseTypeRepository = ExpenseTypeRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateExpenseTypeCommandResponse> Handle(UpdateExpenseTypeCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _ExpenseTypeRepository.GetByIdAsync(request.ExpenseTypeID);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(ExpenseType), request.ExpenseTypeID);
            }



            var updateExpenseTypeCommandResponse = new UpdateExpenseTypeCommandResponse();

            var validator = new UpdateExpenseTypeCommandValidator(_ExpenseTypeRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateExpenseTypeCommandResponse.Success = false;
                updateExpenseTypeCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateExpenseTypeCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateExpenseTypeCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateExpenseTypeCommand), typeof(ExpenseType));

           
                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _ExpenseTypeRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateExpenseTypeCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    updateExpenseTypeCommandResponse.Data = _mapper.Map<UpdateExpenseTypeDto>(recordToUpdate);

                }

            }


            return updateExpenseTypeCommandResponse;



        }

    }
}
