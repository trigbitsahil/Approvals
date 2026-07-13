using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListByVendor
{
    public class GetExpenseTransactionListByVendorQueryHandler :
        IRequestHandler<GetExpenseTransactionListByVendorQuery, GetExpenseTransactionListByVendorQueryResponse>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;

        private readonly IMapper _mapper;
        public GetExpenseTransactionListByVendorQueryHandler(IMapper mapper, IExpenseTransactionRepository ExpenseTransactionRepository)
        {
            _mapper = mapper;
            _ExpenseTransactionRepository = ExpenseTransactionRepository;
        }




        public async Task<GetExpenseTransactionListByVendorQueryResponse> Handle(GetExpenseTransactionListByVendorQuery request, CancellationToken cancellationToken)
        {



            GetExpenseTransactionListByVendorQueryResponse getExpenseTransactionListByVendorQueryResponse = new GetExpenseTransactionListByVendorQueryResponse();



            if (getExpenseTransactionListByVendorQueryResponse.Success)
            {

                // List<ExpenseTransaction> entitylist = await _ExpenseTransactionRepository.ListAllAsync();
                List<ExpenseTransactionListByVendorVM> entitylist = await _ExpenseTransactionRepository.ListAllExpenseTransactionsByVendorAsync(request.MediaId, request.VendorId);



                if (entitylist == null)
                {
                    getExpenseTransactionListByVendorQueryResponse.Success = false;

                }
                else
                {
                    //getExpenseTransactionListByVendorQueryResponse.Data = _mapper.Map<List<ExpenseTransactionListByVendorVM>>(entitylist);

                    getExpenseTransactionListByVendorQueryResponse.Data = entitylist;

                }

            }

            return getExpenseTransactionListByVendorQueryResponse;


        }


    }
}
