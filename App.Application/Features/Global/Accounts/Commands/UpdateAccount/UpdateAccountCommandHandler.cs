using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Accounts.Commands.UpdateAccount
{
    public class UpdateAccountCommandHandler : IRequestHandler<UpdateAccountCommand, UpdateAccountCommandResponse>
    {
        private readonly IAccountRepository _AccountRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateAccountCommandHandler(IMapper mapper, IAccountRepository AccountRepository)
        {
            _mapper = mapper;
            _AccountRepository = AccountRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateAccountCommandResponse> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _AccountRepository.GetByIdAsync(request.AccountID);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(Account), request.AccountID);
            }



            var updateAccountCommandResponse = new UpdateAccountCommandResponse();

            var validator = new UpdateAccountCommandValidator(_AccountRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateAccountCommandResponse.Success = false;
                updateAccountCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateAccountCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateAccountCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateAccountCommand), typeof(Account));

           
                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _AccountRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateAccountCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    updateAccountCommandResponse.Data = _mapper.Map<UpdateAccountDto>(recordToUpdate);

                }

            }


            return updateAccountCommandResponse;



        }

    }
}
