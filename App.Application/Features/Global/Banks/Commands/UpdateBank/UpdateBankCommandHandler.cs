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

            if (request.InitialBalanceAmount.HasValue)
            {
                var transaction = new BankTransaction
                {
                    TransactionId = "BnkTrxn_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                    ToBankId = bank.BankId,
                    ApprovalId = "-", // Required but no approval for initial balance
                    TransactionType = "Deposit",
                    Amount = request.InitialBalanceAmount.Value,
                    Deposit = request.InitialBalanceAmount.Value,
                    Withdrawal = 0,
                    RunningBalance = request.InitialBalanceAmount.Value, // Assuming no other transactions exist yet
                    ClearedOn = DateTime.UtcNow,
                    CreatedBy = request.LastModifiedBy ?? "System",
                    CreatedDate = DateTime.UtcNow,
                    TenantId = bank.TenantId,
                    IsVoided = false
                };
                await _bankTransactionRepository.AddAsync(transaction);
            }
            else
            {
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
            }

            return true;
        }
    }
}
