using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using OOH.Application.Contracts.Infrastructure;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail
{
    public class GetApprovalDetailQueryHandler :
     IRequestHandler<GetApprovalDetailQuery, GetApprovalDetailQueryResponse>
    {

        private readonly IApprovalRepository _ApprovalRepository;
        private readonly IEncryptionService _encryptionService;
        private readonly IMapper _mapper;
        public GetApprovalDetailQueryHandler(IMapper mapper, IApprovalRepository ApprovalRepository, IEncryptionService encryptionService)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
            _encryptionService = encryptionService;
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
                    entity.Name = !string.IsNullOrEmpty(entity.Name) ? _encryptionService.Decrypt(entity.Name) : entity.Name;
                    entity.Description = !string.IsNullOrEmpty(entity.Description) ? _encryptionService.Decrypt(entity.Description) : entity.Description;
                    entity.Reference = !string.IsNullOrEmpty(entity.Reference) ? _encryptionService.Decrypt(entity.Reference) : entity.Reference;
                    entity.Details = !string.IsNullOrEmpty(entity.Details) ? _encryptionService.Decrypt(entity.Details) : entity.Details;
                    entity.ApprovalType = !string.IsNullOrEmpty(entity.ApprovalType) ? _encryptionService.Decrypt(entity.ApprovalType) : entity.ApprovalType;
                    entity.Priority = !string.IsNullOrEmpty(entity.Priority) ? _encryptionService.Decrypt(entity.Priority) : entity.Priority;

                    getApprovalDetailQueryResponse.Data = entity;
                }

            }


            return getApprovalDetailQueryResponse;



        }


    }
}
