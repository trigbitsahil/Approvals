using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Accounts.Commands.CreateAccount
{
    public class CreateAccountCommandHandler : IRequestHandler<CreateAccountCommand, CreateAccountCommandResponse>
    {
        private readonly IAccountRepository _AccountRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        public CreateAccountCommandHandler(IMapper mapper, IAccountRepository AccountRepository, IEmailService emailService)
        {
            _mapper = mapper;
            _AccountRepository = AccountRepository;
            _emailService = emailService;
        }




        public async Task<CreateAccountCommandResponse> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
        {

            var createAccountCommandResponse = new CreateAccountCommandResponse();

            var validator = new CreateAccountCommandValidator(_AccountRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createAccountCommandResponse.Success = false;
                createAccountCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createAccountCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createAccountCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.Account, DateTime.Now, System.Guid.NewGuid().ToString());




                Account entity = _mapper.Map<Account>(request);


                entity.AccountId = entityKeyColumnValue;
 


                int i = await _AccountRepository.AddAsync(entity);

                if (i == -1)
                {
                    createAccountCommandResponse.Success = false;

                }
                else
                {
                    createAccountCommandResponse.Data = _mapper.Map<CreateAccountDto>(entity);

                }

            }


            return createAccountCommandResponse;



        }


    }
}
