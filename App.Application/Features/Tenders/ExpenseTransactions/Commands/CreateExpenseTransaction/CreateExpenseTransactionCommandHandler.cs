using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.CreateExpenseTransaction
{
    public class CreateExpenseTransactionCommandHandler : IRequestHandler<CreateExpenseTransactionCommand, CreateExpenseTransactionCommandResponse>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        public CreateExpenseTransactionCommandHandler(IMapper mapper, IExpenseTransactionRepository ExpenseTransactionRepository, IEmailService emailService)
        {
            _mapper = mapper;
            _ExpenseTransactionRepository = ExpenseTransactionRepository;
            _emailService = emailService;
        }




        public async Task<CreateExpenseTransactionCommandResponse> Handle(CreateExpenseTransactionCommand request, CancellationToken cancellationToken)
        {

            var createExpenseTransactionCommandResponse = new CreateExpenseTransactionCommandResponse();

            var validator = new CreateExpenseTransactionCommandValidator(_ExpenseTransactionRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createExpenseTransactionCommandResponse.Success = false;
                createExpenseTransactionCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createExpenseTransactionCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createExpenseTransactionCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.ExpenseTransaction, DateTime.Now, System.Guid.NewGuid().ToString());




                ExpenseTransaction entity = _mapper.Map<ExpenseTransaction>(request);


                entity.ExpenseTransactionId = entityKeyColumnValue;
 


                int i = await _ExpenseTransactionRepository.AddAsync(entity);

                if (i == -1)
                {
                    createExpenseTransactionCommandResponse.Success = false;

                }
                else
                {
                    createExpenseTransactionCommandResponse.Data = _mapper.Map<CreateExpenseTransactionDto>(entity);

                }

            }


            return createExpenseTransactionCommandResponse;



        }


    }
}
