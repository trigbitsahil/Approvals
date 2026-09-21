using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.BankTransactions.Commands.ReceiveFromDistributor
{
    public class ReceiveFromDistributorCommandHandler : IRequestHandler<ReceiveFromDistributorCommand, ReceiveFromDistributorCommandResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly ILoggedInUserService _loggedInUserService;
        private readonly IApprovalHistoryRepository _historyRepository;

        private static readonly List<string> AuthorizedConfirmationEmails = new List<string>
        {
            "sanny.panesar@gmail.com",
            "shahid.hakim@gmail.com",
            "sumaiya.shaikh@gmail.com",
            "sumaiya.shaikh@wallop.in"
        };

        public ReceiveFromDistributorCommandHandler(
            IBankTransactionRepository bankTransactionRepository,
            IBankRepository bankRepository,
            IApprovalRepository approvalRepository,
            ILoggedInUserService loggedInUserService,
            IApprovalHistoryRepository historyRepository = null)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _approvalRepository = approvalRepository;
            _loggedInUserService = loggedInUserService;
            _historyRepository = historyRepository;
        }

        public async Task<ReceiveFromDistributorCommandResponse> Handle(ReceiveFromDistributorCommand request, CancellationToken cancellationToken)
        {
            var response = new ReceiveFromDistributorCommandResponse();

            string userEmail = (_loggedInUserService.UserEmail ?? "").ToLower();
            bool isAuthorized = AuthorizedConfirmationEmails.Any(e => e.ToLower() == userEmail);

            if (!isAuthorized && _loggedInUserService.UserRole != "SuperAdmin")
            {
                response.Success = false;
                response.Message = "Only authorized approvers can process receive from distributor.";
                return response;
            }

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

            Approval approval = null;
            if (!string.IsNullOrEmpty(transaction.ApprovalId))
            {
                approval = await _approvalRepository.GetByIdAsync(transaction.ApprovalId);
            }

            string distributorId = transaction.DistributorId
                ?? approval?.DistributorId
                ?? matchingTxs.FirstOrDefault(t => !string.IsNullOrEmpty(t.DistributorId))?.DistributorId
                ?? matchingTxs.FirstOrDefault(t => !string.IsNullOrEmpty(t.ToBankId) && t.ToBankId.StartsWith("Dstrbtr_"))?.ToBankId;

            string sourceBankId = matchingTxs.FirstOrDefault(t => !string.IsNullOrEmpty(t.FromBankId) && !t.FromBankId.StartsWith("Dstrbtr_"))?.FromBankId
                ?? approval?.FromBankId;

            if (string.IsNullOrEmpty(distributorId))
            {
                response.Success = false;
                response.Message = "Distributor account not found for this transaction.";
                return response;
            }

            if (string.IsNullOrEmpty(sourceBankId))
            {
                response.Success = false;
                response.Message = "Source bank account not found for this transaction.";
                return response;
            }

            // Find distributor ledger transaction for this approval
            var distTx = matchingTxs.FirstOrDefault(t => 
                (t.ToBankId == distributorId || (string.IsNullOrEmpty(t.FromBankId) && (t.ToBankId == null || t.ToBankId == distributorId || t.ToBankId.StartsWith("Dstrbtr_", StringComparison.OrdinalIgnoreCase)))) && 
                t.TransactionType != "Refund" && 
                t.Deposit > 0
            ) ?? allTxs.FirstOrDefault(t => 
                !string.IsNullOrEmpty(transaction.ApprovalId) && 
                t.ApprovalId == transaction.ApprovalId && 
                (t.ToBankId == distributorId || (string.IsNullOrEmpty(t.FromBankId) && (t.ToBankId == null || t.ToBankId == distributorId || t.ToBankId.StartsWith("Dstrbtr_", StringComparison.OrdinalIgnoreCase)))) && 
                !t.IsVoided && 
                t.TransactionType != "Refund" && 
                t.Deposit > 0
            );

            decimal alreadyRefunded = matchingTxs
                .Where(t => t.TransactionType == "Refund" && !t.IsVoided)
                .Sum(t => t.Amount);

            decimal distDeposit = distTx?.Deposit > 0 ? distTx.Deposit : (approval?.TransactionAmount ?? transaction.Amount);
            decimal distWithdrawal = distTx?.Withdrawal ?? 0;
            decimal leftover = Math.Max(0, distDeposit - distWithdrawal - alreadyRefunded);

            if (leftover <= 0)
            {
                response.Success = false;
                response.Message = "No leftover amount available to receive from distributor.";
                return response;
            }

            decimal refundAmt = (request.Amount.HasValue && request.Amount.Value > 0) ? Math.Min(request.Amount.Value, leftover) : leftover;

            // Calculate running balance for Source Bank receiving the refund (ToBank = sourceBankId)
            var sourceBankTxs = allTxs.Where(t => !t.IsVoided && (
                (t.FromBankId == sourceBankId && (t.IsPaidToDistributor || t.IsConfirm)) ||
                (t.ToBankId == sourceBankId && t.IsConfirm)
            )).ToList();

            decimal sourceBankPrevBal = sourceBankTxs.Sum(t => (t.ToBankId == sourceBankId ? t.Deposit : 0) - (t.FromBankId == sourceBankId ? t.Withdrawal : 0));
            decimal sourceBankNewBalance = sourceBankPrevBal + refundAmt;

            // Calculate distributor net running balance across all approvals
            var distAllTxs = allTxs.Where(t => !t.IsVoided && (t.TransactionType == "Refund" || t.IsPaidToDistributor || t.IsConfirm) &&
                (t.DistributorId == distributorId || t.ToBankId == distributorId || t.FromBankId == distributorId)).ToList();

            var distApprovalGroups = distAllTxs.Where(t => !string.IsNullOrEmpty(t.ApprovalId) && t.ApprovalId != "-").GroupBy(t => t.ApprovalId).ToList();

            decimal calcTotalReceived = 0;
            decimal calcTotalPaid = 0;

            foreach (var g in distApprovalGroups)
            {
                var dep = g.FirstOrDefault(t => (t.ToBankId == distributorId || (string.IsNullOrEmpty(t.FromBankId) && (t.ToBankId == null || t.ToBankId == distributorId || t.ToBankId.StartsWith("Dstrbtr_", StringComparison.OrdinalIgnoreCase)))) && t.TransactionType != "Refund" && t.Deposit > 0)
                          ?? g.FirstOrDefault(t => t.TransactionType != "Refund");

                decimal depAmt = dep?.Deposit > 0 ? dep.Deposit : (dep?.Amount ?? 0);
                calcTotalReceived += depAmt;

                decimal confSpent = (dep != null && dep.IsConfirm) ? dep.Withdrawal : 0;
                decimal refunds = g.Where(t => t.TransactionType == "Refund" || t.FromBankId == distributorId).Sum(t => t.Amount);
                if (g.Key == transaction.ApprovalId)
                {
                    refunds += refundAmt;
                }

                decimal effectiveWth = Math.Max(dep?.Withdrawal ?? 0, confSpent + refunds);
                if (depAmt > 0 && effectiveWth > depAmt) effectiveWth = depAmt;

                calcTotalPaid += effectiveWth;
            }

            decimal distNewRunningBalance = Math.Max(0, calcTotalReceived - calcTotalPaid);

            // Create new refund BankTransaction record
            var refundTx = new BankTransaction
            {
                TransactionId = "Txn_" + DateTime.Now.ToString("yyyy_MM_dd") + Guid.NewGuid().ToString(),
                ApprovalId = transaction.ApprovalId,
                FromBankId = distributorId,    // From Distributor
                ToBankId = sourceBankId,        // To Source Bank
                DistributorId = distributorId,
                VendorId = transaction.VendorId ?? approval?.VendorId,
                DebtorId = transaction.DebtorId ?? approval?.DebtorId,
                TransactionType = "Refund",
                Amount = refundAmt,
                Deposit = refundAmt,            // Added to Source Bank
                Withdrawal = refundAmt,         // Deducted from Distributor
                RunningBalance = sourceBankNewBalance,
                IsPaidToDistributor = true,
                IsConfirm = true,
                Remarks = !string.IsNullOrEmpty(request.Remarks) ? request.Remarks : $"Leftover amount of ₹{refundAmt} received back from distributor to source bank.",
                CreatedBy = _loggedInUserService?.UserEmail ?? "System",
                CreatedDate = DateTime.UtcNow,
                TenantId = transaction.TenantId ?? approval?.TenantId ?? "TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3"
            };

            await _bankTransactionRepository.AddAsync(refundTx);

            // Update distributorTx running balance
            if (distTx != null)
            {
                distTx.RunningBalance = distNewRunningBalance;
                distTx.LastModifiedBy = _loggedInUserService?.UserEmail ?? "System";
                distTx.LastModifiedDate = DateTime.UtcNow;

                await _bankTransactionRepository.UpdateAsync(distTx);
            }

            // Log approval history
            if (_historyRepository != null && !string.IsNullOrEmpty(transaction.ApprovalId))
            {
                await _historyRepository.LogHistoryAsync(
                    transaction.ApprovalId,
                    "Received from Distributor",
                    $"Leftover amount of ₹{refundAmt} received back from distributor to source bank.",
                    _loggedInUserService?.UserEmail ?? "Bank Manager",
                    (_loggedInUserService?.UserEmail ?? "Bank Manager").Split('@')[0],
                    request.Remarks
                );
            }

            response.Success = true;
            response.Message = $"Successfully received ₹{refundAmt} from distributor back to source bank.";
            return response;
        }
    }
}
