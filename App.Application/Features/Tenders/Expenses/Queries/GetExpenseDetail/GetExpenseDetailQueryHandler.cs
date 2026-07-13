using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseDetail
{
    public class GetExpenseDetailQueryHandler :
     IRequestHandler<GetExpenseDetailQuery, GetExpenseDetailQueryResponse>
    {

        private readonly IExpenseRepository _ExpenseRepository;

        private readonly IMapper _mapper;
        public GetExpenseDetailQueryHandler(IMapper mapper, IExpenseRepository ExpenseRepository)
        {
            _mapper = mapper;
            _ExpenseRepository = ExpenseRepository;
        }



        public async Task<GetExpenseDetailQueryResponse> Handle(GetExpenseDetailQuery request, CancellationToken cancellationToken)
        {

            GetExpenseDetailQueryResponse getExpenseDetailQueryResponse = new GetExpenseDetailQueryResponse();

            var validator = new GetExpenseDetailQueryValidator(_ExpenseRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getExpenseDetailQueryResponse.Success = false;
                getExpenseDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getExpenseDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getExpenseDetailQueryResponse.Success)
            {

                Expense entity = await _ExpenseRepository.GetByIdAsync(request.ExpenseID);



                if (entity == null)
                {
                    getExpenseDetailQueryResponse.Success = false;

                }
                else
                {
                    getExpenseDetailQueryResponse.Data = _mapper.Map<ExpenseDetailVM>(entity);

                }

            }


            return getExpenseDetailQueryResponse;



        }


    }
}
