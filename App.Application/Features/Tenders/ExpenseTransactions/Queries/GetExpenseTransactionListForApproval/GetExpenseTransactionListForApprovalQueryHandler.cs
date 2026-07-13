using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListForApproval
{
    public class GetExpenseTransactionListForApprovalQueryHandler :
        IRequestHandler<GetExpenseTransactionListForApprovalQuery, GetExpenseTransactionListForApprovalQueryResponse>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;

        private readonly IMapper _mapper;
        public GetExpenseTransactionListForApprovalQueryHandler(IMapper mapper, IExpenseTransactionRepository ExpenseTransactionRepository)
        {
            _mapper = mapper;
            _ExpenseTransactionRepository = ExpenseTransactionRepository;
        }




        public async Task<GetExpenseTransactionListForApprovalQueryResponse> Handle(GetExpenseTransactionListForApprovalQuery request, CancellationToken cancellationToken)
        {



            GetExpenseTransactionListForApprovalQueryResponse getExpenseTransactionListForApprovalQueryResponse = new GetExpenseTransactionListForApprovalQueryResponse();



            if (getExpenseTransactionListForApprovalQueryResponse.Success)
            {

                // List<ExpenseTransaction> entitylist = await _ExpenseTransactionRepository.ListAllAsync();
                List<ExpenseTransactionListForApprovalVM> entitylist = await _ExpenseTransactionRepository.ListAllExpenseTransactionsForApprovalAsync( );



                if (entitylist == null)
                {
                    getExpenseTransactionListForApprovalQueryResponse.Success = false;

                }
                else
                {
                    //getExpenseTransactionListForApprovalQueryResponse.Data = _mapper.Map<List<ExpenseTransactionListForApprovalVM>>(entitylist);
                
                    getExpenseTransactionListForApprovalQueryResponse.Data = entitylist;

                }

            }

            return getExpenseTransactionListForApprovalQueryResponse;


        }


    }
}
