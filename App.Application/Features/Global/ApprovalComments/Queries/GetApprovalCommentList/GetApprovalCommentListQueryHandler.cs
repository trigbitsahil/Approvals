using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentList
{
    public class GetApprovalCommentListQueryHandler :
        IRequestHandler<GetApprovalCommentListQuery, GetApprovalCommentListQueryResponse>
    {
        private readonly IApprovalCommentRepository _ApprovalCommentRepository;

        private readonly IMapper _mapper;
        public GetApprovalCommentListQueryHandler(IMapper mapper, IApprovalCommentRepository ApprovalCommentRepository)
        {
            _mapper = mapper;
            _ApprovalCommentRepository = ApprovalCommentRepository;
        }




        public async Task<GetApprovalCommentListQueryResponse> Handle(GetApprovalCommentListQuery request, CancellationToken cancellationToken)
        {



            GetApprovalCommentListQueryResponse getApprovalCommentListQueryResponse = new GetApprovalCommentListQueryResponse();



            if (getApprovalCommentListQueryResponse.Success)
            {

               // List<ApprovalComment> entitylist = await _ApprovalCommentRepository.ListAllAsync();
                List<ApprovalCommentListVM> entitylist = await _ApprovalCommentRepository.ListAllApprovalCommentsAsync(request.ApprovalId );



                if (entitylist == null)
                {
                    getApprovalCommentListQueryResponse.Success = false;

                }
                else
                {
                    // getApprovalCommentListQueryResponse.Data = _mapper.Map<List<ApprovalCommentListVM>>(entitylist);

                    getApprovalCommentListQueryResponse.Data = entitylist;

                }

            }

            return getApprovalCommentListQueryResponse;


        }


    }
}
