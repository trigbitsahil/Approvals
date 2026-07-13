using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverDetail
{
    public class GetApprovalApproverDetailQueryHandler :
     IRequestHandler<GetApprovalApproverDetailQuery, GetApprovalApproverDetailQueryResponse>
    {

        private readonly IApprovalApproverRepository _ApprovalApproverRepository;

        private readonly IMapper _mapper;
        public GetApprovalApproverDetailQueryHandler(IMapper mapper, IApprovalApproverRepository ApprovalApproverRepository)
        {
            _mapper = mapper;
            _ApprovalApproverRepository = ApprovalApproverRepository;
        }



        public async Task<GetApprovalApproverDetailQueryResponse> Handle(GetApprovalApproverDetailQuery request, CancellationToken cancellationToken)
        {

            GetApprovalApproverDetailQueryResponse getApprovalApproverDetailQueryResponse = new GetApprovalApproverDetailQueryResponse();

            var validator = new GetApprovalApproverDetailQueryValidator(_ApprovalApproverRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getApprovalApproverDetailQueryResponse.Success = false;
                getApprovalApproverDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getApprovalApproverDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getApprovalApproverDetailQueryResponse.Success)
            {

                ApprovalApprover entity = await _ApprovalApproverRepository.GetByIdAsync(request.ApprovalApproverID);



                if (entity == null)
                {
                    getApprovalApproverDetailQueryResponse.Success = false;

                }
                else
                {
                    getApprovalApproverDetailQueryResponse.Data = _mapper.Map<ApprovalApproverDetailVM>(entity);

                }

            }


            return getApprovalApproverDetailQueryResponse;



        }


    }
}
