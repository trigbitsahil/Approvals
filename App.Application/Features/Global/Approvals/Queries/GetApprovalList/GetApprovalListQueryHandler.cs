using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Infrastructure;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalList
{
    public class GetApprovalListQueryHandler :
        IRequestHandler<GetApprovalListQuery, GetApprovalListQueryResponse>
    {
        private readonly IApprovalRepository _ApprovalRepository;
        private readonly IEncryptionService _encryptionService;
        private readonly IMapper _mapper;
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;
        private readonly ILoggedInUserService _loggedInUserService;

        public GetApprovalListQueryHandler(IMapper mapper, IApprovalRepository ApprovalRepository, IEncryptionService encryptionService, IBankTransactionRepository bankTransactionRepository, IBankRepository bankRepository, ILoggedInUserService loggedInUserService)
        {
            _mapper = mapper;
            _ApprovalRepository = ApprovalRepository;
            _encryptionService = encryptionService;
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _loggedInUserService = loggedInUserService;
        }

        public async Task<GetApprovalListQueryResponse> Handle(GetApprovalListQuery request, CancellationToken cancellationToken)
        {
            GetApprovalListQueryResponse getApprovalListQueryResponse = new GetApprovalListQueryResponse();

            if (getApprovalListQueryResponse.Success)
            {
                List<ApprovalListVM> entitylist = await _ApprovalRepository.ListAllApprovalsAsync(request.Category, request.CategoryID);

                if (entitylist == null)
                {
                    getApprovalListQueryResponse.Success = false;
                }
                else
                {
                    var allBanks = await _bankRepository.ListAllAsync();
                    if (!string.Equals(_loggedInUserService.UserRole, "superadmin", System.StringComparison.OrdinalIgnoreCase) &&
                        !string.Equals(_loggedInUserService.UserRole, "admin", System.StringComparison.OrdinalIgnoreCase))
                    {
                        var userBanks = allBanks.Where(b => b.UserId == _loggedInUserService.UserId).Select(b => b.BankId).ToList();
                        if (userBanks.Any())
                        {
                            entitylist = entitylist.Where(a => 
                                (string.IsNullOrEmpty(a.FromBankId) && string.IsNullOrEmpty(a.ToBankId)) || 
                                (!string.IsNullOrEmpty(a.FromBankId) && userBanks.Contains(a.FromBankId)) || 
                                (!string.IsNullOrEmpty(a.ToBankId) && userBanks.Contains(a.ToBankId))
                            ).ToList();
                        }
                    }

                    var allBankTransactions = await _bankTransactionRepository.ListAllAsync();

                    foreach (var entity in entitylist)
                    {
                        entity.Name = !string.IsNullOrEmpty(entity.Name) ? _encryptionService.Decrypt(entity.Name) : entity.Name;
                        entity.Description = !string.IsNullOrEmpty(entity.Description) ? _encryptionService.Decrypt(entity.Description) : entity.Description;
                        entity.Reference = !string.IsNullOrEmpty(entity.Reference) ? _encryptionService.Decrypt(entity.Reference) : entity.Reference;
                        entity.Details = !string.IsNullOrEmpty(entity.Details) ? _encryptionService.Decrypt(entity.Details) : entity.Details;
                        entity.ApprovalType = !string.IsNullOrEmpty(entity.ApprovalType) ? _encryptionService.Decrypt(entity.ApprovalType) : entity.ApprovalType;
                        entity.Priority = !string.IsNullOrEmpty(entity.Priority) ? _encryptionService.Decrypt(entity.Priority) : entity.Priority;
                        
                        entity.IsReversed = allBankTransactions.Any(bt => bt.ApprovalId == entity.ApprovalID && bt.IsReversed);
                    }
                    getApprovalListQueryResponse.Data = entitylist;
                }
            }

            return getApprovalListQueryResponse;
        }
    }
}
