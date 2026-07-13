using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList
{
    public class GetExpenseTransactionListQueryHandler :
        IRequestHandler<GetExpenseTransactionListQuery, GetExpenseTransactionListQueryResponse>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;

        private readonly IMapper _mapper;
        public GetExpenseTransactionListQueryHandler(IMapper mapper, IExpenseTransactionRepository ExpenseTransactionRepository)
        {
            _mapper = mapper;
            _ExpenseTransactionRepository = ExpenseTransactionRepository;
        }




        public async Task<GetExpenseTransactionListQueryResponse> Handle(GetExpenseTransactionListQuery request, CancellationToken cancellationToken)
        {



            GetExpenseTransactionListQueryResponse getExpenseTransactionListQueryResponse = new GetExpenseTransactionListQueryResponse();



            if (getExpenseTransactionListQueryResponse.Success)
            {

                // List<ExpenseTransaction> entitylist = await _ExpenseTransactionRepository.ListAllAsync();
                List<ExpenseTransactionListVM> entitylist = await _ExpenseTransactionRepository.ListAllExpenseTransactionsAsync(request.Category, request.CategoryID);



                if (entitylist == null)
                {
                    getExpenseTransactionListQueryResponse.Success = false;

                }
                else
                {
                    //getExpenseTransactionListQueryResponse.Data = _mapper.Map<List<ExpenseTransactionListVM>>(entitylist);

                    getExpenseTransactionListQueryResponse.Data = entitylist;

                }

            }

            return getExpenseTransactionListQueryResponse;


        }


    }
}
