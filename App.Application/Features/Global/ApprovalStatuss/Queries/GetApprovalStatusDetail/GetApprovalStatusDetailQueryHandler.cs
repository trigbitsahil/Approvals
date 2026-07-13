using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusDetail
{
    public class GetApprovalStatusDetailQueryHandler :
     IRequestHandler<GetApprovalStatusDetailQuery, GetApprovalStatusDetailQueryResponse>
    {

        private readonly IApprovalStatusRepository _ApprovalStatusRepository;

        private readonly IMapper _mapper;
        public GetApprovalStatusDetailQueryHandler(IMapper mapper, IApprovalStatusRepository ApprovalStatusRepository)
        {
            _mapper = mapper;
            _ApprovalStatusRepository = ApprovalStatusRepository;
        }



        public async Task<GetApprovalStatusDetailQueryResponse> Handle(GetApprovalStatusDetailQuery request, CancellationToken cancellationToken)
        {

            GetApprovalStatusDetailQueryResponse getApprovalStatusDetailQueryResponse = new GetApprovalStatusDetailQueryResponse();

            var validator = new GetApprovalStatusDetailQueryValidator(_ApprovalStatusRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                getApprovalStatusDetailQueryResponse.Success = false;
                getApprovalStatusDetailQueryResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    getApprovalStatusDetailQueryResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (getApprovalStatusDetailQueryResponse.Success)
            {

                ApprovalStatus entity = await _ApprovalStatusRepository.GetByIdAsync(request.ApprovalStatusID);



                if (entity == null)
                {
                    getApprovalStatusDetailQueryResponse.Success = false;

                }
                else
                {
                    getApprovalStatusDetailQueryResponse.Data = _mapper.Map<ApprovalStatusDetailVM>(entity);

                }

            }


            return getApprovalStatusDetailQueryResponse;



        }


    }
}
