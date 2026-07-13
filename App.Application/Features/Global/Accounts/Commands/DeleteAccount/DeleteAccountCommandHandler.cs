using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Accounts.Commands.DeleteAccount
{
    public class DeleteAccountCommandHandler :
       IRequestHandler<DeleteAccountCommand, DeleteAccountCommandResponse>
    {
        private readonly IAccountRepository _AccountRepository;


        private readonly IMapper _mapper;
        public DeleteAccountCommandHandler(IMapper mapper, IAccountRepository AccountRepository)
        {
            _mapper = mapper;
            _AccountRepository = AccountRepository;
        }



        public async Task<DeleteAccountCommandResponse> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
        {

            DeleteAccountCommandResponse deleteAccountCommandResponse = new DeleteAccountCommandResponse();

            var validator = new DeleteAccountCommandValidator(_AccountRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteAccountCommandResponse.Success = false;
                deleteAccountCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteAccountCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteAccountCommandResponse.Success)
            {

                Account entity = await _AccountRepository.GetByIdAsync(request.AccountID);

                int result;


                if (entity == null)
                {
                    deleteAccountCommandResponse.Success = false;

                    deleteAccountCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _AccountRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteAccountCommandResponse.Success = false;

                        deleteAccountCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteAccountCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteAccountCommandResponse;



        }


    }
}
