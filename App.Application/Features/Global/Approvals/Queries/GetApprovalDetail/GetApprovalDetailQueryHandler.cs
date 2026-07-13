using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail
{
    public class GetApprovalDetailQueryHandler :
     IRequestHandler<GetApprovalDetailQuery, GetApprovalDetailQueryResponse>
    {

        private readonly IApprovalRepository _ApprovalRepository;

        private readonly IMapper _mapper;
        public GetApprovalDetailQueryHandler(IMapper mapper, IApprovalRepository ApprovalRepository)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
        }



        public async Task<GetApprovalDetailQueryResponse> Handle(GetApprovalDetailQuery request, CancellationToken cancellationToken)
        {

            GetApprovalDetailQueryResponse getApprovalDetailQueryResponse = new GetApprovalDetailQueryResponse();

            var validator = new GetApprovalDetailQueryValidator(_ApprovalRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getApprovalDetailQueryResponse.Success = false;
                getApprovalDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getApprovalDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getApprovalDetailQueryResponse.Success)
            {

                Approval entity1 = await _ApprovalRepository.GetByIdAsync(request.ApprovalID);
                ApprovalDetailVM entity = await _ApprovalRepository.GetApprovalDetails(request.ApprovalID, entity1.Category);

                

                if (entity == null)
                {
                    getApprovalDetailQueryResponse.Success = false;

                }
                else
                {
                   // getApprovalDetailQueryResponse.Data = _mapper.Map<ApprovalDetailVM>(entity);

                    getApprovalDetailQueryResponse.Data = entity;


                }

            }


            return getApprovalDetailQueryResponse;



        }


    }
}
