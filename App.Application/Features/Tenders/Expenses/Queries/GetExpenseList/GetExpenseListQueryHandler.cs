using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseList
{
    public class GetExpenseListQueryHandler :
        IRequestHandler<GetExpenseListQuery, GetExpenseListQueryResponse>
    {
        private readonly IExpenseRepository _ExpenseRepository;

        private readonly IMapper _mapper;
        public GetExpenseListQueryHandler(IMapper mapper, IExpenseRepository ExpenseRepository)
        {
            _mapper = mapper;
            _ExpenseRepository = ExpenseRepository;
        }




        public async Task<GetExpenseListQueryResponse> Handle(GetExpenseListQuery request, CancellationToken cancellationToken)
        {



            GetExpenseListQueryResponse getExpenseListQueryResponse = new GetExpenseListQueryResponse();



            if (getExpenseListQueryResponse.Success)
            {

                // List<Expense> entitylist = await _ExpenseRepository.ListAllAsync();
                List<ExpenseListVM> entitylist = await _ExpenseRepository.ListAllExpensesAsync(request.ExpenseTypeID );



                if (entitylist == null)
                {
                    getExpenseListQueryResponse.Success = false;

                }
                else
                {
                    //getExpenseListQueryResponse.Data = _mapper.Map<List<ExpenseListVM>>(entitylist);

                    getExpenseListQueryResponse.Data = entitylist;

                }

            }

            return getExpenseListQueryResponse;


        }


    }
}
