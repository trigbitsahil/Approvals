using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusList
{
    public class GetApprovalStatusListQueryHandler :
        IRequestHandler<GetApprovalStatusListQuery, GetApprovalStatusListQueryResponse>
    {
        private readonly IApprovalStatusRepository _ApprovalStatusRepository;

        private readonly IMapper _mapper;
        public GetApprovalStatusListQueryHandler(IMapper mapper, IApprovalStatusRepository ApprovalStatusRepository)
        {
            _mapper = mapper;
            _ApprovalStatusRepository = ApprovalStatusRepository;
        }




        public async Task<GetApprovalStatusListQueryResponse> Handle(GetApprovalStatusListQuery request, CancellationToken cancellationToken)
        {



            GetApprovalStatusListQueryResponse getApprovalStatusListQueryResponse = new GetApprovalStatusListQueryResponse();



            if (getApprovalStatusListQueryResponse.Success)
            {

                 List<ApprovalStatus> entitylist = await _ApprovalStatusRepository.ListAllAsync();
               // List<ApprovalStatusListVM> entitylist = await _ApprovalStatusRepository.ListAllApprovalStatussAsync(request.Category, request.CategoryID);



                if (entitylist == null)
                {
                    getApprovalStatusListQueryResponse.Success = false;

                }
                else
                {
                    getApprovalStatusListQueryResponse.Data = _mapper.Map<List<ApprovalStatusListVM>>(entitylist);

                   // getApprovalStatusListQueryResponse.Data = entitylist;

                }

            }

            return getApprovalStatusListQueryResponse;


        }


    }
}
