using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.Banks.Queries.GetBankList
{
    public class GetBankListQueryHandler : IRequestHandler<GetBankListQuery, GetBankListQueryResponse>
    {
        private readonly IBankRepository _bankRepository;
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRetentionBalanceRepository _bankRetentionBalanceRepository;
        private readonly ILoggedInUserService _loggedInUserService;
        private readonly IEncryptionService _encryptionService;

        public GetBankListQueryHandler(
            IBankRepository bankRepository,
            IBankTransactionRepository bankTransactionRepository,
            IBankRetentionBalanceRepository bankRetentionBalanceRepository,
            ILoggedInUserService loggedInUserService,
            IEncryptionService encryptionService)
        {
            _bankRepository = bankRepository;
            _bankTransactionRepository = bankTransactionRepository;
            _bankRetentionBalanceRepository = bankRetentionBalanceRepository;
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

        public async Task<GetBankListQueryResponse> Handle(GetBankListQuery request, CancellationToken cancellationToken)
        {
            var banks = await _bankRepository.ListAllAsync();
            var activeBanks = banks.Where(b => b.Status == "Active" && !b.IsVoided).ToList();

            var allTransactions = await _bankTransactionRepository.ListAllAsync();
            var retentionList = await _bankRetentionBalanceRepository.GetAllRetentionBalancesAsync();
            var retentionMap = retentionList.ToDictionary(r => r.BankId);

            var vm = activeBanks.Select(b =>
            {
                retentionMap.TryGetValue(b.BankId, out var ret);
                decimal retDep = ret?.TotalDeposit ?? 0;
                decimal retWth = ret?.TotalWithdrawal ?? 0;
                decimal retRb = ret?.RunningBalance ?? 0;

                var bankTxs = allTransactions
                    .Where(t => !t.IsVoided && (
                        (t.FromBankId == b.BankId && (t.IsPaidToDistributor || t.IsConfirm)) ||
                        (t.ToBankId == b.BankId && (t.IsConfirm || t.TransactionType == "Refund"))
                    ))
                    .OrderBy(x => x.CreatedDate)
                    .ToList();

                decimal survivingDeposits = 0;
                decimal survivingWithdrawals = 0;
                decimal rb = retRb;

                foreach (var t in bankTxs)
                {
                    bool isWithdrawal = t.FromBankId == b.BankId;
                    bool isDeposit = t.ToBankId == b.BankId;

                    decimal currentWithdrawal = isWithdrawal ? (t.Withdrawal > 0 ? t.Withdrawal : t.Amount) : 0;
                    decimal currentDeposit = isDeposit ? (t.Deposit > 0 ? t.Deposit : t.Amount) : 0;

                    survivingDeposits += currentDeposit;
                    survivingWithdrawals += currentWithdrawal;
                    rb = rb + currentDeposit - currentWithdrawal;
                }

                return new BankListVM
                {
                    BankId = b.BankId,
                    Name = SafeDecrypt(b.Name),
                    Type = SafeDecrypt(b.Type),
                    Description = SafeDecrypt(b.Description),
                    Address = SafeDecrypt(b.Address),
                    UserId = b.UserId,
                    Status = b.Status,
                    IsActive = b.IsActive,
                    RunningBalance = rb,
                    TotalDeposit = survivingDeposits + retDep,
                    TotalWithdrawal = survivingWithdrawals + retWth,
                    RetentionTotalDeposit = retDep,
                    RetentionTotalWithdrawal = retWth,
                    RetentionRunningBalance = retRb
                };
            }).ToList();

            return new GetBankListQueryResponse
            {
                Success = true,
                Data = vm
            };
        }
    }
}
