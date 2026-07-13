using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Accounts.Queries.GetAccountDetail
{
    public class GetAccountDetailQueryHandler :
     IRequestHandler<GetAccountDetailQuery, GetAccountDetailQueryResponse>
    {

        private readonly IAccountRepository _AccountRepository;

        private readonly IMapper _mapper;
        public GetAccountDetailQueryHandler(IMapper mapper, IAccountRepository AccountRepository)
        {
            _mapper = mapper;
            _AccountRepository = AccountRepository;
        }



        public async Task<GetAccountDetailQueryResponse> Handle(GetAccountDetailQuery request, CancellationToken cancellationToken)
        {

            GetAccountDetailQueryResponse getAccountDetailQueryResponse = new GetAccountDetailQueryResponse();

            var validator = new GetAccountDetailQueryValidator(_AccountRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getAccountDetailQueryResponse.Success = false;
                getAccountDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getAccountDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getAccountDetailQueryResponse.Success)
            {

                Account entity = await _AccountRepository.GetByIdAsync(request.AccountID);



                if (entity == null)
                {
                    getAccountDetailQueryResponse.Success = false;

                }
                else
                {
                    getAccountDetailQueryResponse.Data = _mapper.Map<AccountDetailVM>(entity);

                }

            }


            return getAccountDetailQueryResponse;



        }


    }
}
