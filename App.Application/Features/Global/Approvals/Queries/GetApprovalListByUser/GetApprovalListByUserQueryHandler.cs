using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalListByUser;
using OOH.Application.Contracts.Infrastructure;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalListByUser
{
    public class GetApprovalListByUserQueryHandler :
        IRequestHandler<GetApprovalListByUserQuery, GetApprovalListByUserQueryResponse>
    {
        private readonly IApprovalRepository _ApprovalRepository;
        private readonly IEncryptionService _encryptionService;
        private readonly IMapper _mapper;

        public GetApprovalListByUserQueryHandler(IMapper mapper, IApprovalRepository ApprovalRepository, IEncryptionService encryptionService)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
            _encryptionService = encryptionService;
        }

        public async Task<GetApprovalListByUserQueryResponse> Handle(GetApprovalListByUserQuery request, CancellationToken cancellationToken)
        {
            GetApprovalListByUserQueryResponse response = new GetApprovalListByUserQueryResponse();

            if (response.Success)
            {
                List<ApprovalListByUserVM> entitylist = await _ApprovalRepository.ListAllApprovalsByUserAsync();

                if (entitylist == null)
                {
                    response.Success = false;
                }
                else
                {
                    foreach (var entity in entitylist)
                    {
                        entity.Name = !string.IsNullOrEmpty(entity.Name) ? _encryptionService.Decrypt(entity.Name) : entity.Name;
                        entity.Description = !string.IsNullOrEmpty(entity.Description) ? _encryptionService.Decrypt(entity.Description) : entity.Description;
                        entity.Reference = !string.IsNullOrEmpty(entity.Reference) ? _encryptionService.Decrypt(entity.Reference) : entity.Reference;
                        entity.Details = !string.IsNullOrEmpty(entity.Details) ? _encryptionService.Decrypt(entity.Details) : entity.Details;
                        entity.ApprovalType = !string.IsNullOrEmpty(entity.ApprovalType) ? _encryptionService.Decrypt(entity.ApprovalType) : entity.ApprovalType;
                        entity.Priority = !string.IsNullOrEmpty(entity.Priority) ? _encryptionService.Decrypt(entity.Priority) : entity.Priority;
                    }
                    response.Data = entitylist;
                }
            }

            return response;
        }
    }
}

