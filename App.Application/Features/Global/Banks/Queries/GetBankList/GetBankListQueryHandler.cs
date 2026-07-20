using AutoMapper;
using MediatR;
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
        private readonly OOH.Application.Contracts.Infrastructure.ILoggedInUserService _loggedInUserService;

        public GetBankListQueryHandler(IBankRepository bankRepository, OOH.Application.Contracts.Infrastructure.ILoggedInUserService loggedInUserService)
        {
            _bankRepository = bankRepository;
            _loggedInUserService = loggedInUserService;
        }

        public async Task<List<BankListVM>> Handle(GetBankListQuery request, CancellationToken cancellationToken)
        {
            var banks = await _bankRepository.ListAllAsync();
            var activeBanks = banks.Where(b => b.Status == "Active" && !b.IsVoided).ToList();

            if (!string.Equals(_loggedInUserService.UserRole, "superadmin", System.StringComparison.OrdinalIgnoreCase))
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
                Name = b.Name,
                Type = b.Type,
                Description = b.Description,
                Address = b.Address,
                UserId = b.UserId,
                Status = b.Status,
                IsActive = b.IsActive,
                RunningBalance = 0
            }).ToList();

            return vm;
        }
    }
}
