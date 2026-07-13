using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalComments.Queries.GetApprovalCommentDetail
{
    public class GetApprovalCommentDetailQueryHandler :
     IRequestHandler<GetApprovalCommentDetailQuery, GetApprovalCommentDetailQueryResponse>
    {

        private readonly IApprovalCommentRepository _ApprovalCommentRepository;

        private readonly IMapper _mapper;
        public GetApprovalCommentDetailQueryHandler(IMapper mapper, IApprovalCommentRepository ApprovalCommentRepository)
        {
            _mapper = mapper;
            _ApprovalCommentRepository = ApprovalCommentRepository;
        }



        public async Task<GetApprovalCommentDetailQueryResponse> Handle(GetApprovalCommentDetailQuery request, CancellationToken cancellationToken)
        {

            GetApprovalCommentDetailQueryResponse getApprovalCommentDetailQueryResponse = new GetApprovalCommentDetailQueryResponse();

            var validator = new GetApprovalCommentDetailQueryValidator(_ApprovalCommentRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getApprovalCommentDetailQueryResponse.Success = false;
                getApprovalCommentDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getApprovalCommentDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getApprovalCommentDetailQueryResponse.Success)
            {

                ApprovalComment entity = await _ApprovalCommentRepository.GetByIdAsync(request.ApprovalCommentId);



                if (entity == null)
                {
                    getApprovalCommentDetailQueryResponse.Success = false;

                }
                else
                {
                    getApprovalCommentDetailQueryResponse.Data = _mapper.Map<ApprovalCommentDetailVM>(entity);

                }

            }


            return getApprovalCommentDetailQueryResponse;



        }


    }
}
