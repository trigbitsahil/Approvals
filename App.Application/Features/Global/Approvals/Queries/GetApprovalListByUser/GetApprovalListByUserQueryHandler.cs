using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalListByUser;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalListByUser
{
    public class GetApprovalListByUserQueryHandler :
        IRequestHandler<GetApprovalListByUserQuery, GetApprovalListByUserQueryResponse>
    {
        private readonly IApprovalRepository _ApprovalRepository;

        private readonly IMapper _mapper;
        public GetApprovalListByUserQueryHandler(IMapper mapper, IApprovalRepository ApprovalRepository)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
        }




        public async Task<GetApprovalListByUserQueryResponse> Handle(GetApprovalListByUserQuery request, CancellationToken cancellationToken)
        {



            GetApprovalListByUserQueryResponse GetApprovalListByUserQueryResponse = new GetApprovalListByUserQueryResponse();



            if (GetApprovalListByUserQueryResponse.Success)
            {

                // List<Approval> entitylist = await _ApprovalRepository.ListAllAsync();
                List<ApprovalListByUserVM> entitylist = await _ApprovalRepository.ListAllApprovalsByUserAsync();



                if (entitylist == null)
                {
                    GetApprovalListByUserQueryResponse.Success = false;

                }
                else
                {
                    //GetApprovalListByUserQueryResponse.Data = _mapper.Map<List<ApprovalListVM>>(entitylist);

                    GetApprovalListByUserQueryResponse.Data = entitylist;

                }

            }

            return GetApprovalListByUserQueryResponse;


        }


    }
}
