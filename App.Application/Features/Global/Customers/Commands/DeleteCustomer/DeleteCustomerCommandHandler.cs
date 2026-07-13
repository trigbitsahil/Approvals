using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Customers.Commands.DeleteCustomer
{
    public class DeleteCustomerCommandHandler :
       IRequestHandler<DeleteCustomerCommand, DeleteCustomerCommandResponse>
    {
        private readonly ICustomerRepository _CustomerRepository;


        private readonly IMapper _mapper;
        public DeleteCustomerCommandHandler(IMapper mapper, ICustomerRepository CustomerRepository)
        {
            _mapper = mapper;
            _CustomerRepository = CustomerRepository;
        }



        public async Task<DeleteCustomerCommandResponse> Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
        {

            DeleteCustomerCommandResponse deleteCustomerCommandResponse = new DeleteCustomerCommandResponse();

            var validator = new DeleteCustomerCommandValidator(_CustomerRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteCustomerCommandResponse.Success = false;
                deleteCustomerCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteCustomerCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteCustomerCommandResponse.Success)
            {

                Customer entity = await _CustomerRepository.GetByIdAsync(request.CustomerId);

                int result;


                if (entity == null)
                {
                    deleteCustomerCommandResponse.Success = false;

                    deleteCustomerCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _CustomerRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteCustomerCommandResponse.Success = false;

                        deleteCustomerCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteCustomerCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteCustomerCommandResponse;



        }


    }
}
