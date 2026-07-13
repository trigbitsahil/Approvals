using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverList
{
    public class GetApprovalApproverListQueryHandler :
        IRequestHandler<GetApprovalApproverListQuery, GetApprovalApproverListQueryResponse>
    {
        private readonly IApprovalApproverRepository _ApprovalApproverRepository;

        private readonly IMapper _mapper;
        public GetApprovalApproverListQueryHandler(IMapper mapper, IApprovalApproverRepository ApprovalApproverRepository)
        {
            _mapper = mapper;
            _ApprovalApproverRepository = ApprovalApproverRepository;
        }




        public async Task<GetApprovalApproverListQueryResponse> Handle(GetApprovalApproverListQuery request, CancellationToken cancellationToken)
        {



            GetApprovalApproverListQueryResponse getApprovalApproverListQueryResponse = new GetApprovalApproverListQueryResponse();



            if (getApprovalApproverListQueryResponse.Success)
            {

                // List<ApprovalApprover> entitylist = await _ApprovalApproverRepository.ListAllAsync();
                List<ApprovalApproverListVM> entitylist = await _ApprovalApproverRepository.ListAllApprovalApproversAsync(request.ApprovalID );



                if (entitylist == null)
                {
                    getApprovalApproverListQueryResponse.Success = false;

                }
                else
                {
                    //getApprovalApproverListQueryResponse.Data = _mapper.Map<List<ApprovalApproverListVM>>(entitylist);

                    getApprovalApproverListQueryResponse.Data = entitylist;

                }

            }

            return getApprovalApproverListQueryResponse;


        }


    }
}
