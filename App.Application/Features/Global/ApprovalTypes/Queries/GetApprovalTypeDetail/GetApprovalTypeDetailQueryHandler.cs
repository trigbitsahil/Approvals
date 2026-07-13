using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeDetail
{
    public class GetApprovalTypeDetailQueryHandler :
     IRequestHandler<GetApprovalTypeDetailQuery, GetApprovalTypeDetailQueryResponse>
    {

        private readonly IApprovalTypeRepository _ApprovalTypeRepository;

        private readonly IMapper _mapper;
        public GetApprovalTypeDetailQueryHandler(IMapper mapper, IApprovalTypeRepository ApprovalTypeRepository)
        {
            _mapper = mapper;
            _ApprovalTypeRepository = ApprovalTypeRepository;
        }



        public async Task<GetApprovalTypeDetailQueryResponse> Handle(GetApprovalTypeDetailQuery request, CancellationToken cancellationToken)
        {

            GetApprovalTypeDetailQueryResponse getApprovalTypeDetailQueryResponse = new GetApprovalTypeDetailQueryResponse();

            var validator = new GetApprovalTypeDetailQueryValidator(_ApprovalTypeRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getApprovalTypeDetailQueryResponse.Success = false;
                getApprovalTypeDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getApprovalTypeDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getApprovalTypeDetailQueryResponse.Success)
            {

                ApprovalType entity = await _ApprovalTypeRepository.GetByIdAsync(request.ApprovalTypeID);



                if (entity == null)
                {
                    getApprovalTypeDetailQueryResponse.Success = false;

                }
                else
                {
                    getApprovalTypeDetailQueryResponse.Data = _mapper.Map<ApprovalTypeDetailVM>(entity);

                }

            }


            return getApprovalTypeDetailQueryResponse;



        }


    }
}
