using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList2
{
    public class GetExpenseTransactionList2QueryHandler :
        IRequestHandler<GetExpenseTransactionList2Query, GetExpenseTransactionList2QueryResponse>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;

        private readonly IMapper _mapper;
        public GetExpenseTransactionList2QueryHandler(IMapper mapper, IExpenseTransactionRepository ExpenseTransactionRepository)
        {
            _mapper = mapper;
            _ExpenseTransactionRepository = ExpenseTransactionRepository;
        }




        public async Task<GetExpenseTransactionList2QueryResponse> Handle(GetExpenseTransactionList2Query request, CancellationToken cancellationToken)
        {



            GetExpenseTransactionList2QueryResponse getExpenseTransactionList2QueryResponse = new GetExpenseTransactionList2QueryResponse();



            if (getExpenseTransactionList2QueryResponse.Success)
            {

                // List<ExpenseTransaction> entitylist = await _ExpenseTransactionRepository.ListAllAsync();
                List<ExpenseTransactionList2VM> entitylist = await _ExpenseTransactionRepository.ListAllExpenseTransactionsAsync2(request.Category, request.CategoryID);



                if (entitylist == null)
                {
                    getExpenseTransactionList2QueryResponse.Success = false;

                }
                else
                {
                    //getExpenseTransactionList2QueryResponse.Data = _mapper.Map<List<ExpenseTransactionList2VM>>(entitylist);

                    getExpenseTransactionList2QueryResponse.Data = entitylist;

                }

            }

            return getExpenseTransactionList2QueryResponse;


        }


    }
}
