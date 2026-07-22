using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Banks.Queries.GetBankList
{
    public class GetBankListQueryHandler : IRequestHandler<GetBankListQuery, List<BankListVM>>
    {
        private readonly IBankRepository _bankRepository;
        private readonly ILoggedInUserService _loggedInUserService;
        private readonly IEncryptionService _encryptionService;

        public GetBankListQueryHandler(IBankRepository bankRepository, ILoggedInUserService loggedInUserService, IEncryptionService encryptionService)
        {
            _bankRepository = bankRepository;
            _loggedInUserService = loggedInUserService;
            _encryptionService = encryptionService;
        }

        private string SafeDecrypt(string value)
        {
            if (string.IsNullOrEmpty(value)) return value;
            try
            {
                return _encryptionService.Decrypt(value);
            }
            catch
            {
                // Fallback for older, unencrypted data
                return value;
            }
        }

        public async Task<List<BankListVM>> Handle(GetBankListQuery request, CancellationToken cancellationToken)
        {
            var banks = await _bankRepository.ListAllAsync();
            var activeBanks = banks.Where(b => b.Status == "Active" && !b.IsVoided).ToList();

            if (!string.Equals(_loggedInUserService.UserRole, "superadmin", System.StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(_loggedInUserService.UserRole, "admin", System.StringComparison.OrdinalIgnoreCase))
            {
                var userBanks = activeBanks.Where(b => b.UserId == _loggedInUserService.UserId).ToList();
                if (userBanks.Any())
                {
                    activeBanks = userBanks;
                }
            }

            var vm = activeBanks.Select(b => new BankListVM
            {
                BankId = b.BankId,
                Name = SafeDecrypt(b.Name),
                Type = SafeDecrypt(b.Type),
                Description = SafeDecrypt(b.Description),
                Address = SafeDecrypt(b.Address),
                UserId = b.UserId,
                Status = b.Status,
                IsActive = b.IsActive,
                RunningBalance = 0
            }).ToList();

            return vm;
        }
    }
}
