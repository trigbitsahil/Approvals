using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Expenses.Commands.CreateExpense
{
    public class CreateExpenseCommandHandler : IRequestHandler<CreateExpenseCommand, CreateExpenseCommandResponse>
    {
        private readonly IExpenseRepository _ExpenseRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        public CreateExpenseCommandHandler(IMapper mapper, IExpenseRepository ExpenseRepository, IEmailService emailService)
        {
            _mapper = mapper;
            _ExpenseRepository = ExpenseRepository;
            _emailService = emailService;
        }




        public async Task<CreateExpenseCommandResponse> Handle(CreateExpenseCommand request, CancellationToken cancellationToken)
        {

            var createExpenseCommandResponse = new CreateExpenseCommandResponse();

            var validator = new CreateExpenseCommandValidator(_ExpenseRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createExpenseCommandResponse.Success = false;
                createExpenseCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createExpenseCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createExpenseCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.Expense, DateTime.Now, System.Guid.NewGuid().ToString());




                Expense entity = _mapper.Map<Expense>(request);


                entity.ExpenseId = entityKeyColumnValue;
 


                int i = await _ExpenseRepository.AddAsync(entity);

                if (i == -1)
                {
                    createExpenseCommandResponse.Success = false;

                }
                else
                {
                    createExpenseCommandResponse.Data = _mapper.Map<CreateExpenseDto>(entity);

                }

            }


            return createExpenseCommandResponse;



        }


    }
}
