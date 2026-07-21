using MediatR;
using OOH.Application.Contracts.Infrastructure;
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
        private readonly IEncryptionService _encryptionService;

        public CreateBankCommandHandler(IBankRepository bankRepository, IEncryptionService encryptionService)
        {
            _bankRepository = bankRepository;
            _encryptionService = encryptionService;
        }

        public async Task<string> Handle(CreateBankCommand request, CancellationToken cancellationToken)
        {
            var bank = new Bank
            {
                BankId = "Bank_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                Name = !string.IsNullOrEmpty(request.Name) ? _encryptionService.Encrypt(request.Name) : request.Name,
                Type = !string.IsNullOrEmpty(request.Type) ? _encryptionService.Encrypt(request.Type) : request.Type,
                Description = !string.IsNullOrEmpty(request.Description) ? _encryptionService.Encrypt(request.Description) : request.Description,
                Address = !string.IsNullOrEmpty(request.Address) ? _encryptionService.Encrypt(request.Address) : request.Address,
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
