using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalList
{
    public class GetApprovalListQueryHandler :
        IRequestHandler<GetApprovalListQuery, GetApprovalListQueryResponse>
    {
        private readonly IApprovalRepository _ApprovalRepository;

        private readonly IMapper _mapper;
        public GetApprovalListQueryHandler(IMapper mapper, IApprovalRepository ApprovalRepository)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
        }




        public async Task<GetApprovalListQueryResponse> Handle(GetApprovalListQuery request, CancellationToken cancellationToken)
        {



            GetApprovalListQueryResponse getApprovalListQueryResponse = new GetApprovalListQueryResponse();



            if (getApprovalListQueryResponse.Success)
            {

                // List<Approval> entitylist = await _ApprovalRepository.ListAllAsync();
                List<ApprovalListVM> entitylist = await _ApprovalRepository.ListAllApprovalsAsync(request.Category, request.CategoryID);



                if (entitylist == null)
                {
                    getApprovalListQueryResponse.Success = false;

                }
                else
                {
                    //getApprovalListQueryResponse.Data = _mapper.Map<List<ApprovalListVM>>(entitylist);

                    getApprovalListQueryResponse.Data = entitylist;

                }

            }

            return getApprovalListQueryResponse;


        }


    }
}
