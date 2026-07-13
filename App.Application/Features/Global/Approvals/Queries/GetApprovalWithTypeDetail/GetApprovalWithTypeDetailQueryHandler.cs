using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalWithTypeDetail
{
    public class GetApprovalWithTypeDetailQueryHandler :
     IRequestHandler<GetApprovalWithTypeDetailQuery, GetApprovalWithTypeDetailQueryResponse>
    {

        private readonly IApprovalRepository _ApprovalRepository;

        private readonly IMapper _mapper;
        public GetApprovalWithTypeDetailQueryHandler(IMapper mapper, IApprovalRepository ApprovalRepository)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
        }
 


        public async Task<GetApprovalWithTypeDetailQueryResponse> Handle(GetApprovalWithTypeDetailQuery request, CancellationToken cancellationToken)
        {

            GetApprovalWithTypeDetailQueryResponse getApprovalWithTypeDetailQueryResponse = new GetApprovalWithTypeDetailQueryResponse();

            var validator = new GetApprovalWithTypeDetailQueryValidator(_ApprovalRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getApprovalWithTypeDetailQueryResponse.Success = false;
                getApprovalWithTypeDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getApprovalWithTypeDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getApprovalWithTypeDetailQueryResponse.Success)
            {

                Approval entity1 = await _ApprovalRepository.GetByIdAsync(request.ApprovalID);
                ApprovalWithTypeDetailVM entity = await _ApprovalRepository.GetApprovalWithApprovalTypeDetails(request.ApprovalID,entity1.Category);

                

                if (entity == null)
                {
                    getApprovalWithTypeDetailQueryResponse.Success = false;

                }
                else
                {
                   // getApprovalWithTypeDetailQueryResponse.Data = _mapper.Map<ApprovalWithTypeDetailVM>(entity);

                    getApprovalWithTypeDetailQueryResponse.Data = entity;


                }

            }


            return getApprovalWithTypeDetailQueryResponse;



        }


    }
}
