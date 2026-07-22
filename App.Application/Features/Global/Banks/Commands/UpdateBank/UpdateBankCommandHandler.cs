using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Banks.Commands.UpdateBank
{
    public class UpdateBankCommandHandler : IRequestHandler<UpdateBankCommand, bool>
    {
        private readonly IBankRepository _bankRepository;
        private readonly IAsyncRepository<BankTransaction> _bankTransactionRepository;
        private readonly IEncryptionService _encryptionService;

        public UpdateBankCommandHandler(IBankRepository bankRepository, IAsyncRepository<BankTransaction> bankTransactionRepository, IEncryptionService encryptionService)
        {
            _bankRepository = bankRepository;
            _bankTransactionRepository = bankTransactionRepository;
            _encryptionService = encryptionService;
        }

        public async Task<bool> Handle(UpdateBankCommand request, CancellationToken cancellationToken)
        {
            var bank = await _bankRepository.GetByIdAsync(request.BankId);
            if (bank == null)
            {
                return false;
            }

            if (request.Name != null) bank.Name = _encryptionService.Encrypt(request.Name);
            if (request.Type != null) bank.Type = _encryptionService.Encrypt(request.Type);
            if (request.Description != null) bank.Description = _encryptionService.Encrypt(request.Description);
            if (request.Address != null) bank.Address = _encryptionService.Encrypt(request.Address);
            if (request.UserId != null) bank.UserId = request.UserId;
            if (request.Status != null) bank.Status = request.Status;
            bank.IsActive = request.IsActive ?? bank.IsActive;
            bank.LastModifiedBy = request.LastModifiedBy;
            bank.LastModifiedDate = DateTime.UtcNow;

            await _bankRepository.UpdateAsync(bank);

            return true;
        }
    }
}
