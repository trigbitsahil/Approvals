using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Customers.Commands.CreateCustomer
{
    public class CreateCustomerCommandHandler : IRequestHandler<CreateCustomerCommand, CreateCustomerCommandResponse>
    {
        private readonly ICustomerRepository _CustomerRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        public CreateCustomerCommandHandler(IMapper mapper, ICustomerRepository CustomerRepository, IEmailService emailService)
        {
            _mapper = mapper;
            _CustomerRepository = CustomerRepository;
            _emailService = emailService;
        }




        public async Task<CreateCustomerCommandResponse> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
        {

            var createCustomerCommandResponse = new CreateCustomerCommandResponse();

            var validator = new CreateCustomerCommandValidator(_CustomerRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createCustomerCommandResponse.Success = false;
                createCustomerCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createCustomerCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createCustomerCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.Customer, DateTime.Now, System.Guid.NewGuid().ToString());




                Customer entity = _mapper.Map<Customer>(request);


                entity.CustomerId = entityKeyColumnValue;
 


                int i = await _CustomerRepository.AddAsync(entity);

                if (i == -1)
                {
                    createCustomerCommandResponse.Success = false;

                }
                else
                {
                    createCustomerCommandResponse.Data = _mapper.Map<CreateCustomerDto>(entity);

                }

            }


            return createCustomerCommandResponse;



        }


    }
}
