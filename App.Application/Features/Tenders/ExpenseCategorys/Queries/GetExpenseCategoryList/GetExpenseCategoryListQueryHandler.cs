using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Queries.GetExpenseCategoryList
{
    public class GetExpenseCategoryListQueryHandler :
        IRequestHandler<GetExpenseCategoryListQuery, GetExpenseCategoryListQueryResponse>
    {
        private readonly IExpenseCategoryRepository _ExpenseCategoryRepository;

        private readonly IMapper _mapper;
        public GetExpenseCategoryListQueryHandler(IMapper mapper, IExpenseCategoryRepository ExpenseCategoryRepository)
        {
            _mapper = mapper;
            _ExpenseCategoryRepository = ExpenseCategoryRepository;
        }




        public async Task<GetExpenseCategoryListQueryResponse> Handle(GetExpenseCategoryListQuery request, CancellationToken cancellationToken)
        {



            GetExpenseCategoryListQueryResponse getExpenseCategoryListQueryResponse = new GetExpenseCategoryListQueryResponse();



            if (getExpenseCategoryListQueryResponse.Success)
            {

                 List<ExpenseCategory> entitylist = await _ExpenseCategoryRepository.ListAllAsync();
                //List<ExpenseCategoryListVM> entitylist = await _ExpenseCategoryRepository.ListAllExpenseCategorysAsync(request.Category, request.CategoryID);



                if (entitylist == null)
                {
                    getExpenseCategoryListQueryResponse.Success = false;

                }
                else
                {
                     getExpenseCategoryListQueryResponse.Data = _mapper.Map<List<ExpenseCategoryListVM>>(entitylist);

                 //   getExpenseCategoryListQueryResponse.Data = entitylist;

                }

            }

            return getExpenseCategoryListQueryResponse;


        }


    }
}
