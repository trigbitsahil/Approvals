using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Queries.GetExpenseTypeList
{
    public class GetExpenseTypeListQueryHandler :
        IRequestHandler<GetExpenseTypeListQuery, GetExpenseTypeListQueryResponse>
    {
        private readonly IExpenseTypeRepository _ExpenseTypeRepository;

        private readonly IMapper _mapper;
        public GetExpenseTypeListQueryHandler(IMapper mapper, IExpenseTypeRepository ExpenseTypeRepository)
        {
            _mapper = mapper;
            _ExpenseTypeRepository = ExpenseTypeRepository;
        }




        public async Task<GetExpenseTypeListQueryResponse> Handle(GetExpenseTypeListQuery request, CancellationToken cancellationToken)
        {



            GetExpenseTypeListQueryResponse getExpenseTypeListQueryResponse = new GetExpenseTypeListQueryResponse();



            if (getExpenseTypeListQueryResponse.Success)
            {

                 // List<ExpenseType> entitylist = await _ExpenseTypeRepository.ListAllAsync();
                List<ExpenseTypeListVM> entitylist = await _ExpenseTypeRepository.ListAllExpenseTypesAsync( );



                if (entitylist == null)
                {
                    getExpenseTypeListQueryResponse.Success = false;

                }
                else
                {
                   // getExpenseTypeListQueryResponse.Data = _mapper.Map<List<ExpenseTypeListVM>>(entitylist);

                   getExpenseTypeListQueryResponse.Data = entitylist;

                }

            }

            return getExpenseTypeListQueryResponse;


        }


    }
}
