using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionSearch
{
    public class GetExpenseTransactionSearchQueryHandler :
        IRequestHandler<GetExpenseTransactionSearchQuery, GetExpenseTransactionSearchQueryResponse>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;

        private readonly IMapper _mapper;
        public GetExpenseTransactionSearchQueryHandler(IMapper mapper, IExpenseTransactionRepository ExpenseTransactionRepository)
        {
            _mapper = mapper;
            _ExpenseTransactionRepository = ExpenseTransactionRepository;
        }




        public async Task<GetExpenseTransactionSearchQueryResponse> Handle(GetExpenseTransactionSearchQuery request, CancellationToken cancellationToken)
        {



            GetExpenseTransactionSearchQueryResponse getExpenseTransactionSearchQueryResponse = new GetExpenseTransactionSearchQueryResponse();



            if (getExpenseTransactionSearchQueryResponse.Success)
            {

                // List<ExpenseTransaction> entitylist = await _ExpenseTransactionRepository.ListAllAsync();
                List<ExpenseTransactionSearchVM> entitylist = await _ExpenseTransactionRepository.ListAllExpenseTransactionsSearchAsync(request.MediaIds, request.ExpenseId, request.ExpenseTypeId,request.VendorId);



                if (entitylist == null)
                {
                    getExpenseTransactionSearchQueryResponse.Success = false;

                }
                else
                {
                    //getExpenseTransactionSearchQueryResponse.Data = _mapper.Map<List<ExpenseTransactionSearchVM>>(entitylist);

                    getExpenseTransactionSearchQueryResponse.Data = entitylist;

                }

            }

            return getExpenseTransactionSearchQueryResponse;


        }


    }
}
