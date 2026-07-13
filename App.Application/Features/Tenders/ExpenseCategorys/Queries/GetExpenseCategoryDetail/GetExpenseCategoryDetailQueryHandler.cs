using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Queries.GetExpenseCategoryDetail
{
    public class GetExpenseCategoryDetailQueryHandler :
     IRequestHandler<GetExpenseCategoryDetailQuery, GetExpenseCategoryDetailQueryResponse>
    {

        private readonly IExpenseCategoryRepository _ExpenseCategoryRepository;

        private readonly IMapper _mapper;
        public GetExpenseCategoryDetailQueryHandler(IMapper mapper, IExpenseCategoryRepository ExpenseCategoryRepository)
        {
            _mapper = mapper;
            _ExpenseCategoryRepository = ExpenseCategoryRepository;
        }



        public async Task<GetExpenseCategoryDetailQueryResponse> Handle(GetExpenseCategoryDetailQuery request, CancellationToken cancellationToken)
        {

            GetExpenseCategoryDetailQueryResponse getExpenseCategoryDetailQueryResponse = new GetExpenseCategoryDetailQueryResponse();

            var validator = new GetExpenseCategoryDetailQueryValidator(_ExpenseCategoryRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getExpenseCategoryDetailQueryResponse.Success = false;
                getExpenseCategoryDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getExpenseCategoryDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getExpenseCategoryDetailQueryResponse.Success)
            {

                ExpenseCategory entity = await _ExpenseCategoryRepository.GetByIdAsync(request.ExpenseCategoryId);



                if (entity == null)
                {
                    getExpenseCategoryDetailQueryResponse.Success = false;

                }
                else
                {
                    getExpenseCategoryDetailQueryResponse.Data = _mapper.Map<ExpenseCategoryDetailVM>(entity);

                }

            }


            return getExpenseCategoryDetailQueryResponse;



        }


    }
}
