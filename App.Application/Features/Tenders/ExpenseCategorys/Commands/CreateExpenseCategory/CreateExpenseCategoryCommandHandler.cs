using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.CreateExpenseCategory
{
    public class CreateExpenseCategoryCommandHandler : IRequestHandler<CreateExpenseCategoryCommand, CreateExpenseCategoryCommandResponse>
    {
        private readonly IExpenseCategoryRepository _ExpenseCategoryRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        public CreateExpenseCategoryCommandHandler(IMapper mapper, IExpenseCategoryRepository ExpenseCategoryRepository, IEmailService emailService)
        {
            _mapper = mapper;
            _ExpenseCategoryRepository = ExpenseCategoryRepository;
            _emailService = emailService;
        }




        public async Task<CreateExpenseCategoryCommandResponse> Handle(CreateExpenseCategoryCommand request, CancellationToken cancellationToken)
        {

            var createExpenseCategoryCommandResponse = new CreateExpenseCategoryCommandResponse();

            var validator = new CreateExpenseCategoryCommandValidator(_ExpenseCategoryRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createExpenseCategoryCommandResponse.Success = false;
                createExpenseCategoryCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createExpenseCategoryCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createExpenseCategoryCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.ExpenseCategory, DateTime.Now, System.Guid.NewGuid().ToString());




                ExpenseCategory entity = _mapper.Map<ExpenseCategory>(request);


                entity.ExpenseCategoryId = entityKeyColumnValue;
 


                int i = await _ExpenseCategoryRepository.AddAsync(entity);

                if (i == -1)
                {
                    createExpenseCategoryCommandResponse.Success = false;

                }
                else
                {
                    createExpenseCategoryCommandResponse.Data = _mapper.Map<CreateExpenseCategoryDto>(entity);

                }

            }


            return createExpenseCategoryCommandResponse;



        }


    }
}
