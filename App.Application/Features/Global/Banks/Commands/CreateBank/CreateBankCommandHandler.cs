using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Banks.Commands.CreateBank
{
    public class CreateBankCommandHandler : IRequestHandler<CreateBankCommand, string>
    {
        private readonly IBankRepository _bankRepository;

        public CreateBankCommandHandler(IBankRepository bankRepository)
        {
            _bankRepository = bankRepository;
        }

        public async Task<string> Handle(CreateBankCommand request, CancellationToken cancellationToken)
        {
            var bank = new Bank
            {
                BankId = "Bank_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                Name = request.Name,
                Type = request.Type,
                Description = request.Description,
                Address = request.Address,
                UserId = request.UserId,
                Status = request.Status ?? "Active",
                CreatedBy = request.CreatedBy ?? "System",
                CreatedDate = DateTime.UtcNow,
                TenantId = request.TenantId ?? "TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3",
                IsVoided = false
            };

            await _bankRepository.AddAsync(bank);
            return bank.BankId;
        }
    }
}
