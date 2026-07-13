using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeList
{
    public class GetApprovalTypeListQueryHandler :
        IRequestHandler<GetApprovalTypeListQuery, GetApprovalTypeListQueryResponse>
    {
        private readonly IApprovalTypeRepository _ApprovalTypeRepository;

        private readonly IMapper _mapper;
        public GetApprovalTypeListQueryHandler(IMapper mapper, IApprovalTypeRepository ApprovalTypeRepository)
        {
            _mapper = mapper;
            _ApprovalTypeRepository = ApprovalTypeRepository;
        }




        public async Task<GetApprovalTypeListQueryResponse> Handle(GetApprovalTypeListQuery request, CancellationToken cancellationToken)
        {



            GetApprovalTypeListQueryResponse getApprovalTypeListQueryResponse = new GetApprovalTypeListQueryResponse();



            if (getApprovalTypeListQueryResponse.Success)
            {

                  List<ApprovalType> entitylist = await _ApprovalTypeRepository.ListAllAsync();
              //  List<ApprovalTypeListVM> entitylist = await _ApprovalTypeRepository.ListAllApprovalTypesAsync(request.Category, request.CategoryID);



                if (entitylist == null)
                {
                    getApprovalTypeListQueryResponse.Success = false;

                }
                else
                {
                     getApprovalTypeListQueryResponse.Data = _mapper.Map<List<ApprovalTypeListVM>>(entitylist);

                  //  getApprovalTypeListQueryResponse.Data = entitylist;

                }

            }

            return getApprovalTypeListQueryResponse;


        }


    }
}
