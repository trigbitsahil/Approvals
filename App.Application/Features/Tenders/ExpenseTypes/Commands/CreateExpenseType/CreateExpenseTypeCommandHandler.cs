using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.CreateExpenseType
{
    public class CreateExpenseTypeCommandHandler : IRequestHandler<CreateExpenseTypeCommand, CreateExpenseTypeCommandResponse>
    {
        private readonly IExpenseTypeRepository _ExpenseTypeRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        public CreateExpenseTypeCommandHandler(IMapper mapper, IExpenseTypeRepository ExpenseTypeRepository, IEmailService emailService)
        {
            _mapper = mapper;
            _ExpenseTypeRepository = ExpenseTypeRepository;
            _emailService = emailService;
        }




        public async Task<CreateExpenseTypeCommandResponse> Handle(CreateExpenseTypeCommand request, CancellationToken cancellationToken)
        {

            var createExpenseTypeCommandResponse = new CreateExpenseTypeCommandResponse();

            var validator = new CreateExpenseTypeCommandValidator(_ExpenseTypeRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createExpenseTypeCommandResponse.Success = false;
                createExpenseTypeCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createExpenseTypeCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createExpenseTypeCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.ExpenseType, DateTime.Now, System.Guid.NewGuid().ToString());




                ExpenseType entity = _mapper.Map<ExpenseType>(request);


                entity.ExpenseTypeId = entityKeyColumnValue;
 


                int i = await _ExpenseTypeRepository.AddAsync(entity);

                if (i == -1)
                {
                    createExpenseTypeCommandResponse.Success = false;

                }
                else
                {
                    createExpenseTypeCommandResponse.Data = _mapper.Map<CreateExpenseTypeDto>(entity);

                }

            }


            return createExpenseTypeCommandResponse;



        }


    }
}
