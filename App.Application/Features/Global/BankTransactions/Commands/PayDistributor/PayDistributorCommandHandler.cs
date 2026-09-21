using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.BankTransactions.Commands.PayDistributor
{
    public class PayDistributorCommandHandler : IRequestHandler<PayDistributorCommand, PayDistributorCommandResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly ILoggedInUserService _loggedInUserService;
        private readonly IApprovalHistoryRepository _historyRepository;

        public PayDistributorCommandHandler(
            IBankTransactionRepository bankTransactionRepository,
            IBankRepository bankRepository,
            ILoggedInUserService loggedInUserService,
            IApprovalRepository approvalRepository = null,
            IApprovalHistoryRepository historyRepository = null)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _loggedInUserService = loggedInUserService;
            _approvalRepository = approvalRepository;
            _historyRepository = historyRepository;
        }

        public async Task<PayDistributorCommandResponse> Handle(PayDistributorCommand request, CancellationToken cancellationToken)
        {
            var response = new PayDistributorCommandResponse();

            var transaction = await _bankTransactionRepository.GetByIdAsync(request.TransactionId);
            if (transaction == null)
            {
                response.Success = false;
                response.Message = "Transaction not found.";
                return response;
            }

            var allTxs = await _bankTransactionRepository.ListAllAsync();
            var matchingTxs = !string.IsNullOrEmpty(transaction.ApprovalId)
                ? allTxs.Where(t => t.ApprovalId == transaction.ApprovalId && !t.IsVoided).ToList()
                : new List<BankTransaction> { transaction };

            string fromBankId = matchingTxs.FirstOrDefault(t => !string.IsNullOrEmpty(t.FromBankId))?.FromBankId ?? transaction.FromBankId;

            if (!string.IsNullOrEmpty(fromBankId))
            {
                var bank = await _bankRepository.GetByIdAsync(fromBankId);
                if (bank != null && !string.IsNullOrEmpty(bank.UserId))
                {
                    // Check if current user is the assigned bank user
                    bool isAssignedUser = string.Equals(bank.UserId, _loggedInUserService.UserId, StringComparison.OrdinalIgnoreCase) ||
                                          string.Equals(bank.UserId, _loggedInUserService.UserEmail, StringComparison.OrdinalIgnoreCase);

                    if (!isAssignedUser && _loggedInUserService.UserRole != "SuperAdmin")
                    {
                        response.Success = false;
                        response.Message = "Only the assigned user of this From Bank can process Paid to Distributor.";
                        return response;
                    }
                }
            }

            foreach (var tx in matchingTxs)
            {
                tx.IsPaidToDistributor = true;
                tx.LastModifiedBy = _loggedInUserService.UserEmail ?? "System";
                tx.LastModifiedDate = DateTime.UtcNow;

                if (!string.IsNullOrEmpty(tx.FromBankId))
                {
                    tx.Withdrawal = tx.Amount;
                    tx.Deposit = 0;

                    var bankTxs = allTxs.Where(t => t.TransactionId != tx.TransactionId && !t.IsVoided && (
                        (t.FromBankId == tx.FromBankId && (t.IsPaidToDistributor || t.IsConfirm)) ||
                        (t.ToBankId == tx.FromBankId && t.IsConfirm)
                    )).ToList();

                    decimal prevBal = bankTxs.Sum(t => (t.ToBankId == tx.FromBankId ? t.Deposit : 0) - (t.FromBankId == tx.FromBankId ? t.Withdrawal : 0));
                    tx.RunningBalance = prevBal - tx.Amount;
                }

                await _bankTransactionRepository.UpdateAsync(tx);
            }

            // Create a new distributor transaction record if one doesn't exist for this approval
            Approval approval = null;
            if (_approvalRepository != null && !string.IsNullOrEmpty(transaction.ApprovalId))
            {
                approval = await _approvalRepository.GetByIdAsync(transaction.ApprovalId);
            }

            string targetDistributorId = transaction.DistributorId 
                ?? approval?.DistributorId 
                ?? transaction.ToBankId 
                ?? approval?.ToBankId 
                ?? matchingTxs.FirstOrDefault(t => !string.IsNullOrEmpty(t.DistributorId))?.DistributorId 
                ?? matchingTxs.FirstOrDefault(t => !string.IsNullOrEmpty(t.ToBankId))?.ToBankId;

            string sourceFromBankId = fromBankId ?? approval?.FromBankId;

            if (!string.IsNullOrEmpty(targetDistributorId))
            {
                bool alreadyHasDistributorPaymentTx = allTxs.Any(t => t.ApprovalId == transaction.ApprovalId && !t.IsVoided && t.ToBankId == targetDistributorId && t.Deposit > 0 && t.IsPaidToDistributor);
                if (!alreadyHasDistributorPaymentTx)
                {
                    var distTxs = allTxs.Where(t => t.ApprovalId != transaction.ApprovalId && !t.IsVoided && (t.ToBankId == targetDistributorId || t.DistributorId == targetDistributorId) && (t.IsPaidToDistributor || t.IsConfirm)).ToList();
                    decimal distPrevBal = distTxs.Sum(t => (t.ToBankId == targetDistributorId || t.DistributorId == targetDistributorId ? t.Deposit : 0) - (t.FromBankId == targetDistributorId ? t.Withdrawal : 0));
                    decimal distRunningBalance = distPrevBal + transaction.Amount;

                    var distributorTx = new BankTransaction
                    {
                        TransactionId = "Txn_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                        ApprovalId = transaction.ApprovalId,
                        FromBankId = null,
                        ToBankId = targetDistributorId,
                        DistributorId = targetDistributorId,
                        VendorId = transaction.VendorId ?? approval?.VendorId,
                        DebtorId = transaction.DebtorId ?? approval?.DebtorId,
                        TransactionType = transaction.TransactionType ?? approval?.ApprovalType ?? "Bank Transfer",
                        Amount = transaction.Amount,
                        Deposit = transaction.Amount,
                        Withdrawal = 0,
                        RunningBalance = distRunningBalance,
                        IsPaidToDistributor = true,
                        IsConfirm = false,
                        CreatedBy = _loggedInUserService?.UserEmail ?? "System",
                        CreatedDate = DateTime.UtcNow,
                        TenantId = transaction.TenantId ?? approval?.TenantId ?? "TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3"
                    };

                    await _bankTransactionRepository.AddAsync(distributorTx);
                }
            }

            if (_historyRepository != null && !string.IsNullOrEmpty(transaction.ApprovalId))
            {
                await _historyRepository.LogHistoryAsync(
                    transaction.ApprovalId,
                    "Paid to Distributor",
                    $"Bank settlement of ₹{transaction.Amount} marked as Paid to Distributor.",
                    _loggedInUserService?.UserEmail ?? "Bank Manager",
                    (_loggedInUserService?.UserEmail ?? "Bank Manager").Split('@')[0]
                );
            }

            response.Success = true;
            response.Message = "Marked as Paid to Distributor successfully.";
            return response;
        }
    }
}
