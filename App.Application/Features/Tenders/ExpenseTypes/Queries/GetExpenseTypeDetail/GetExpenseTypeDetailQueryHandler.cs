using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Queries.GetExpenseTypeDetail
{
    public class GetExpenseTypeDetailQueryHandler :
     IRequestHandler<GetExpenseTypeDetailQuery, GetExpenseTypeDetailQueryResponse>
    {

        private readonly IExpenseTypeRepository _ExpenseTypeRepository;

        private readonly IMapper _mapper;
        public GetExpenseTypeDetailQueryHandler(IMapper mapper, IExpenseTypeRepository ExpenseTypeRepository)
        {
            _mapper = mapper;
            _ExpenseTypeRepository = ExpenseTypeRepository;
        }



        public async Task<GetExpenseTypeDetailQueryResponse> Handle(GetExpenseTypeDetailQuery request, CancellationToken cancellationToken)
        {

            GetExpenseTypeDetailQueryResponse getExpenseTypeDetailQueryResponse = new GetExpenseTypeDetailQueryResponse();

            var validator = new GetExpenseTypeDetailQueryValidator(_ExpenseTypeRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getExpenseTypeDetailQueryResponse.Success = false;
                getExpenseTypeDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getExpenseTypeDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getExpenseTypeDetailQueryResponse.Success)
            {

                ExpenseType entity = await _ExpenseTypeRepository.GetByIdAsync(request.ExpenseTypeID);



                if (entity == null)
                {
                    getExpenseTypeDetailQueryResponse.Success = false;

                }
                else
                {
                    getExpenseTypeDetailQueryResponse.Data = _mapper.Map<ExpenseTypeDetailVM>(entity);

                }

            }


            return getExpenseTypeDetailQueryResponse;



        }


    }
}
