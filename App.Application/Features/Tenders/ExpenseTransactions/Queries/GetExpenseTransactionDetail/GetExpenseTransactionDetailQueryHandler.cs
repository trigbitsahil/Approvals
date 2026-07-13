using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail
{
    public class GetExpenseTransactionDetailQueryHandler :
     IRequestHandler<GetExpenseTransactionDetailQuery, GetExpenseTransactionDetailQueryResponse>
    {

        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;

        private readonly IMapper _mapper;
        public GetExpenseTransactionDetailQueryHandler(IMapper mapper, IExpenseTransactionRepository ExpenseTransactionRepository)
        {
            _mapper = mapper;
            _ExpenseTransactionRepository = ExpenseTransactionRepository;
        }



        public async Task<GetExpenseTransactionDetailQueryResponse> Handle(GetExpenseTransactionDetailQuery request, CancellationToken cancellationToken)
        {

            GetExpenseTransactionDetailQueryResponse getExpenseTransactionDetailQueryResponse = new GetExpenseTransactionDetailQueryResponse();

            var validator = new GetExpenseTransactionDetailQueryValidator(_ExpenseTransactionRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getExpenseTransactionDetailQueryResponse.Success = false;
                getExpenseTransactionDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getExpenseTransactionDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getExpenseTransactionDetailQueryResponse.Success)
            {

                ExpenseTransactionDetailVM entity = await _ExpenseTransactionRepository.GetExpenseTransactionDetailsAsync(request.ExpenseTransactionID);



                if (entity == null)
                {
                    getExpenseTransactionDetailQueryResponse.Success = false;

                }
                else
                {
                    getExpenseTransactionDetailQueryResponse.Data = entity;// _mapper.Map<ExpenseTransactionDetailVM>(entity);

                }

            }


            return getExpenseTransactionDetailQueryResponse;



        }


    }
}
