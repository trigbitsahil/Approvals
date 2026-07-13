using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.Accounts.Queries.GetAccountList
{
    public class GetAccountListQueryHandler :
        IRequestHandler<GetAccountListQuery, GetAccountListQueryResponse>
    {
        private readonly IAccountRepository _AccountRepository;

        private readonly IMapper _mapper;
        public GetAccountListQueryHandler(IMapper mapper, IAccountRepository AccountRepository)
        {
            _mapper = mapper;
            _AccountRepository = AccountRepository;
        }




        public async Task<GetAccountListQueryResponse> Handle(GetAccountListQuery request, CancellationToken cancellationToken)
        {



            GetAccountListQueryResponse getAccountListQueryResponse = new GetAccountListQueryResponse();



            if (getAccountListQueryResponse.Success)
            {

                // List<Account> entitylist = await _AccountRepository.ListAllAsync();
                List<AccountListVM> entitylist = await _AccountRepository.ListAllAccountsAsync(request.Category, request.CategoryID);



                if (entitylist == null)
                {
                    getAccountListQueryResponse.Success = false;

                }
                else
                {
                    //getAccountListQueryResponse.Data = _mapper.Map<List<AccountListVM>>(entitylist);

                    getAccountListQueryResponse.Data = entitylist;

                }

            }

            return getAccountListQueryResponse;


        }


    }
}
