using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalWithTypeDetail
{
    public class GetApprovalWithTypeDetailQueryHandler :
     IRequestHandler<GetApprovalWithTypeDetailQuery, GetApprovalWithTypeDetailQueryResponse>
    {

        private readonly IApprovalRepository _ApprovalRepository;
        private readonly IEncryptionService _encryptionService;
        private readonly IMapper _mapper;
        public GetApprovalWithTypeDetailQueryHandler(IMapper mapper, IApprovalRepository ApprovalRepository, IEncryptionService encryptionService)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
            _encryptionService = encryptionService;
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
                    if (entity.ApprovalDetails != null)
                    {
                        entity.ApprovalDetails.Name = !string.IsNullOrEmpty(entity.ApprovalDetails.Name) ? _encryptionService.Decrypt(entity.ApprovalDetails.Name) : entity.ApprovalDetails.Name;
                        entity.ApprovalDetails.Description = !string.IsNullOrEmpty(entity.ApprovalDetails.Description) ? _encryptionService.Decrypt(entity.ApprovalDetails.Description) : entity.ApprovalDetails.Description;
                        entity.ApprovalDetails.Reference = !string.IsNullOrEmpty(entity.ApprovalDetails.Reference) ? _encryptionService.Decrypt(entity.ApprovalDetails.Reference) : entity.ApprovalDetails.Reference;
                        entity.ApprovalDetails.Details = !string.IsNullOrEmpty(entity.ApprovalDetails.Details) ? _encryptionService.Decrypt(entity.ApprovalDetails.Details) : entity.ApprovalDetails.Details;
                        entity.ApprovalDetails.ApprovalType = !string.IsNullOrEmpty(entity.ApprovalDetails.ApprovalType) ? _encryptionService.Decrypt(entity.ApprovalDetails.ApprovalType) : entity.ApprovalDetails.ApprovalType;
                        entity.ApprovalDetails.Priority = !string.IsNullOrEmpty(entity.ApprovalDetails.Priority) ? _encryptionService.Decrypt(entity.ApprovalDetails.Priority) : entity.ApprovalDetails.Priority;
                    }

                    getApprovalWithTypeDetailQueryResponse.Data = entity;
                }

            }


            return getApprovalWithTypeDetailQueryResponse;



        }


    }
}
