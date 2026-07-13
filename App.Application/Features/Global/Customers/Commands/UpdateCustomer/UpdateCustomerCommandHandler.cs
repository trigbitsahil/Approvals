using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Customers.Commands.UpdateCustomer
{
    public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand, UpdateCustomerCommandResponse>
    {
        private readonly ICustomerRepository _CustomerRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateCustomerCommandHandler(IMapper mapper, ICustomerRepository CustomerRepository)
        {
            _mapper = mapper;
            _CustomerRepository = CustomerRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateCustomerCommandResponse> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _CustomerRepository.GetByIdAsync(request.CustomerId);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(Customer), request.CustomerId);
            }



            var updateCustomerCommandResponse = new UpdateCustomerCommandResponse();

            var validator = new UpdateCustomerCommandValidator(_CustomerRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateCustomerCommandResponse.Success = false;
                updateCustomerCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateCustomerCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateCustomerCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateCustomerCommand), typeof(Customer));

           
                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _CustomerRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateCustomerCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    updateCustomerCommandResponse.Data = _mapper.Map<UpdateCustomerDto>(recordToUpdate);

                }

            }


            return updateCustomerCommandResponse;



        }

    }
}
