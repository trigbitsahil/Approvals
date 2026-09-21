using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetAllCombinedBankTransactions
{
    public class GetAllCombinedBankTransactionsQueryHandler : IRequestHandler<GetAllCombinedBankTransactionsQuery, GetAllCombinedBankTransactionsQueryResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly IVendorRepository _vendorRepository;
        private readonly IDebtorRepository _debtorRepository;
        private readonly IDistributorRepository _distributorRepository;
        private readonly OOH.Application.Contracts.Infrastructure.IEncryptionService _encryptionService;

        public GetAllCombinedBankTransactionsQueryHandler(
            IBankTransactionRepository bankTransactionRepository,
            IBankRepository bankRepository,
            IApprovalRepository approvalRepository,
            IVendorRepository vendorRepository,
            IDebtorRepository debtorRepository,
            OOH.Application.Contracts.Infrastructure.IEncryptionService encryptionService,
            IDistributorRepository distributorRepository = null)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _approvalRepository = approvalRepository;
            _vendorRepository = vendorRepository;
            _debtorRepository = debtorRepository;
            _encryptionService = encryptionService;
            _distributorRepository = distributorRepository;
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
                return value;
            }
        }

        public async Task<GetAllCombinedBankTransactionsQueryResponse> Handle(GetAllCombinedBankTransactionsQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _bankTransactionRepository.ListAllAsync();
            var banks = await _bankRepository.ListAllAsync();
            var approvals = await _approvalRepository.ListAllAsync();
            var vendors = await _vendorRepository.ListAllAsync();
            var debtors = await _debtorRepository.ListAllAsync();
            var distributors = _distributorRepository != null ? await _distributorRepository.ListAllAsync() : new List<OOH.Domain.Entities.Tenders.Distributor>();

            var dtos = new List<CombinedBankTransactionVM>();

            // Group transactions by ApprovalId (excluding non-approval transactions like standalone ones)
            var groupedByApproval = transactions
                .Where(t => !string.IsNullOrEmpty(t.ApprovalId) && t.ApprovalId != "-" && (t.IsConfirm || t.IsPaidToDistributor) && !t.IsVoided)
                .GroupBy(t => t.ApprovalId)
                .ToList();


            foreach (var group in groupedByApproval)
            {
                var approvalId = group.Key;
                var approval = approvals.FirstOrDefault(a => a.ApprovalId == approvalId);
                string approvalName = approval != null ? SafeDecrypt(approval.Name) : null;
                string approvalReference = approval != null ? SafeDecrypt(approval.Reference) : null;
                string approvalType = approval != null ? SafeDecrypt(approval.ApprovalType) : null;

                // 1. Process Original Transactions (exclude Reversals and Refunds)
                var activeGroup = group.Where(t => t.TransactionType != "Reversal" && t.TransactionType != "Refund").ToList();

                var debitTxn = activeGroup.OrderBy(t => t.CreatedDate).FirstOrDefault(t => 
                    !string.IsNullOrEmpty(t.FromBankId) && 
                    (string.IsNullOrEmpty(t.ToBankId) || t.ToBankId == "-" || !banks.Any(b => b.BankId == t.ToBankId)));
                var legacyTxn = activeGroup.FirstOrDefault(t => 
                    !string.IsNullOrEmpty(t.FromBankId) && 
                    !string.IsNullOrEmpty(t.ToBankId) && 
                    banks.Any(b => b.BankId == t.FromBankId) && 
                    banks.Any(b => b.BankId == t.ToBankId));

                // Distributor deposit row: ToBankId starts with "Dstrbtr_" or matches DistributorId
                var distributorDepositTxn = activeGroup.OrderBy(t => t.CreatedDate).FirstOrDefault(t =>
                    string.IsNullOrEmpty(t.FromBankId) &&
                    !string.IsNullOrEmpty(t.ToBankId) &&
                    (t.ToBankId.StartsWith("Dstrbtr_", System.StringComparison.OrdinalIgnoreCase) ||
                     (!string.IsNullOrEmpty(t.DistributorId) && t.ToBankId == t.DistributorId)));

                // Destination bank credit row (from confirmation – ToBankId is a real bank, not a distributor)
                // Must have IsConfirm = true so this row only exists after the confirmation step
                var destBankCreditTxn = activeGroup.OrderBy(t => t.CreatedDate).FirstOrDefault(t =>
                    t.IsConfirm &&
                    string.IsNullOrEmpty(t.FromBankId) &&
                    !string.IsNullOrEmpty(t.ToBankId) &&
                    !t.ToBankId.StartsWith("Dstrbtr_", System.StringComparison.OrdinalIgnoreCase) &&
                    (string.IsNullOrEmpty(t.DistributorId) || t.ToBankId != t.DistributorId));

                if (debitTxn == null && distributorDepositTxn == null && destBankCreditTxn == null && legacyTxn != null)
                {
                    // Legacy single-row transaction
                    dtos.Add(new CombinedBankTransactionVM
                    {
                        ApprovalId = approvalId,
                        ApprovalName = approvalName,
                        ApprovalReference = approvalReference,
                        ApprovalType = approvalType ?? legacyTxn.TransactionType,
                        Amount = legacyTxn.Amount,
                        FromBankName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == legacyTxn.FromBankId)?.Name),
                        ToBankName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == legacyTxn.ToBankId)?.Name),
                        CompletedOn = (legacyTxn.LastModifiedDate ?? legacyTxn.CreatedDate).ToString("o"),
                        RunningBalanceBank1 = legacyTxn.RunningBalance != 0 ? legacyTxn.RunningBalance : (decimal?)null,
                        RunningBalanceBank2 = null
                    });
                }
                else if (distributorDepositTxn != null)
                {
                    // === Distributor Approval ===

                    var distId = distributorDepositTxn.ToBankId;
                    var distObj = distributors.FirstOrDefault(d => d.DistributorId == distId);
                    string distName = distObj != null ? SafeDecrypt(distObj.Name) : "Distributor";

                    // Source bank running balance (from debit row)
                    decimal? rbSourceBank = debitTxn != null
                        ? (debitTxn.RunningBalance != 0 ? debitTxn.RunningBalance : CalculateDynamicRunningBalance(transactions, debitTxn.FromBankId, debitTxn.TransactionId))
                        : null;

                    // distDep = the amount paid to this distributor for this specific approval
                    decimal distDep = distributorDepositTxn.Deposit > 0 ? distributorDepositTxn.Deposit : distributorDepositTxn.Amount;

                    // Prior distributor balance across all previous approvals
                    decimal priorDistributorBalance = CalculatePriorDistributorBalance(transactions, distId, distributorDepositTxn.CreatedDate, approvalId);

                    // Running balance of distributor after this deposit is received
                    decimal rbDistributor = priorDistributorBalance + distDep;

                    string sourceBankName = debitTxn != null
                        ? SafeDecrypt(banks.FirstOrDefault(b => b.BankId == debitTxn.FromBankId)?.Name)
                        : null;

                    // Row 1: "Paid to Distributor" — From = Source Bank, To = Distributor name
                    dtos.Add(new CombinedBankTransactionVM
                    {
                        ApprovalId = approvalId,
                        ApprovalName = approvalName,
                        ApprovalReference = approvalReference,
                        ApprovalType = "Paid to Distributor",
                        Amount = distDep,
                        FromBankName = sourceBankName,
                        ToBankName = "Distributor: " + distName,
                        CompletedOn = distributorDepositTxn.CreatedDate.ToString("o"),
                        RunningBalanceBank1 = rbSourceBank,
                        RunningBalanceBank2 = rbDistributor
                    });

                    // Row 2: "Confirmation" — From = Distributor, To = Destination Bank or Vendor (only if confirmed)
                    bool isConfirmed = destBankCreditTxn != null || distributorDepositTxn.IsConfirm || (debitTxn != null && debitTxn.IsConfirm);

                    if (isConfirmed)
                    {
                        decimal confAmt = destBankCreditTxn != null
                            ? (destBankCreditTxn.Deposit > 0 ? destBankCreditTxn.Deposit : destBankCreditTxn.Amount)
                            : (distributorDepositTxn.Withdrawal > 0 ? distributorDepositTxn.Withdrawal : distributorDepositTxn.Amount);

                        decimal? rbDestBank = destBankCreditTxn != null
                            ? CalculateDynamicRunningBalance(transactions, destBankCreditTxn.ToBankId, destBankCreditTxn.TransactionId)
                            : null;

                        // Distributor balance after this confirmation
                        decimal rbDistAfterConf = Math.Max(0, (priorDistributorBalance + distDep) - confAmt);

                        string destTargetName = null;
                        if (destBankCreditTxn != null)
                        {
                            destTargetName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == destBankCreditTxn.ToBankId)?.Name);
                        }
                        else
                        {
                            var vendorId = !string.IsNullOrEmpty(distributorDepositTxn.VendorId) 
                                ? distributorDepositTxn.VendorId 
                                : (!string.IsNullOrEmpty(debitTxn?.VendorId) 
                                    ? debitTxn.VendorId 
                                    : approval?.VendorId);

                            if (!string.IsNullOrEmpty(vendorId))
                            {
                                var vendor = vendors.FirstOrDefault(v => v.VendorId == vendorId);
                                destTargetName = "Vendor: " + (vendor != null ? SafeDecrypt(vendor.Name) : vendorId);
                            }
                            else if (approvalType != null && approvalType.Contains("Expense", System.StringComparison.OrdinalIgnoreCase))
                            {
                                destTargetName = "Vendor";
                            }
                        }

                        string confirmCompletedOn = (destBankCreditTxn?.LastModifiedDate 
                            ?? distributorDepositTxn.LastModifiedDate 
                            ?? debitTxn?.LastModifiedDate 
                            ?? distributorDepositTxn.CreatedDate.AddMilliseconds(100)).ToString("o");

                        dtos.Add(new CombinedBankTransactionVM
                        {
                            ApprovalId = approvalId,
                            ApprovalName = approvalName,
                            ApprovalReference = approvalReference,
                            ApprovalType = "Confirmation",
                            Amount = confAmt,
                            FromBankName = "Distributor: " + distName,
                            ToBankName = destTargetName,
                            CompletedOn = confirmCompletedOn,
                            RunningBalanceBank1 = rbDistAfterConf,
                            RunningBalanceBank2 = rbDestBank
                        });
                    }
                }
                else if (activeGroup.Any())
                {
                    // === Regular (Non-Distributor) Approval: Expense, Receipt, Bank-to-Bank ===
                    var primaryTxn = debitTxn ?? destBankCreditTxn ?? activeGroup.OrderBy(t => t.CreatedDate).First();
                    var fromBankId = primaryTxn.FromBankId ?? approval?.FromBankId;
                    var toBankId = primaryTxn.ToBankId ?? approval?.ToBankId;

                    decimal? rbBank1 = !string.IsNullOrEmpty(fromBankId) && banks.Any(b => b.BankId == fromBankId)
                        ? (primaryTxn.RunningBalance != 0 && primaryTxn.FromBankId == fromBankId ? primaryTxn.RunningBalance : CalculateDynamicRunningBalance(transactions, fromBankId, primaryTxn.TransactionId))
                        : null;

                    decimal? rbBank2 = !string.IsNullOrEmpty(toBankId) && banks.Any(b => b.BankId == toBankId)
                        ? CalculateDynamicRunningBalance(transactions, toBankId, primaryTxn.TransactionId)
                        : null;

                    string resolvedFromBankName = null;
                    if (!string.IsNullOrEmpty(fromBankId) && banks.Any(b => b.BankId == fromBankId))
                    {
                        resolvedFromBankName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == fromBankId)?.Name);
                    }
                    else
                    {
                        var debtorId = !string.IsNullOrEmpty(primaryTxn.DebtorId) ? primaryTxn.DebtorId : approval?.DebtorId;
                        if (!string.IsNullOrEmpty(debtorId))
                        {
                            var debtor = debtors.FirstOrDefault(d => d.DebtorId == debtorId);
                            resolvedFromBankName = "Debtor: " + (debtor != null ? SafeDecrypt(debtor.Name) : debtorId);
                        }
                    }

                    string resolvedToBankName = null;
                    if (!string.IsNullOrEmpty(toBankId) && banks.Any(b => b.BankId == toBankId))
                    {
                        resolvedToBankName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == toBankId)?.Name);
                    }
                    else
                    {
                        var vendorId = !string.IsNullOrEmpty(primaryTxn.VendorId) 
                            ? primaryTxn.VendorId 
                            : (!string.IsNullOrEmpty(approval?.VendorId) 
                                ? approval.VendorId 
                                : (!string.IsNullOrEmpty(toBankId) && !banks.Any(b => b.BankId == toBankId) ? toBankId : null));

                        if (!string.IsNullOrEmpty(vendorId))
                        {
                            var vendor = vendors.FirstOrDefault(v => v.VendorId == vendorId);
                            resolvedToBankName = "Vendor: " + (vendor != null ? SafeDecrypt(vendor.Name) : vendorId);
                        }
                        else if (approvalType != null && approvalType.Contains("Expense", System.StringComparison.OrdinalIgnoreCase))
                        {
                            resolvedToBankName = "Vendor";
                        }
                    }

                    decimal effectiveAmount = primaryTxn.Withdrawal > 0 ? primaryTxn.Withdrawal : (primaryTxn.Deposit > 0 ? primaryTxn.Deposit : primaryTxn.Amount);

                    dtos.Add(new CombinedBankTransactionVM
                    {
                        ApprovalId = approvalId,
                        ApprovalName = approvalName,
                        ApprovalReference = approvalReference,
                        ApprovalType = approvalType ?? primaryTxn.TransactionType,
                        Amount = effectiveAmount,
                        FromBankName = resolvedFromBankName,
                        ToBankName = resolvedToBankName,
                        CompletedOn = (primaryTxn.LastModifiedDate ?? primaryTxn.CreatedDate).ToString("o"),
                        RunningBalanceBank1 = rbBank1,
                        RunningBalanceBank2 = rbBank2
                    });
                }

                // 2. Process Reversal Transactions (if any exist in this group)
                var reversalGroup = group.Where(t => t.TransactionType == "Reversal").ToList();
                if (reversalGroup.Any())
                {
                    var revDebitTxn = reversalGroup.OrderBy(t => t.CreatedDate).FirstOrDefault(t => !string.IsNullOrEmpty(t.FromBankId) && string.IsNullOrEmpty(t.ToBankId));
                    var revCreditTxn = reversalGroup.OrderBy(t => t.CreatedDate).FirstOrDefault(t => string.IsNullOrEmpty(t.FromBankId) && !string.IsNullOrEmpty(t.ToBankId));
                    var revLegacyTxn = reversalGroup.FirstOrDefault(t => !string.IsNullOrEmpty(t.FromBankId) && !string.IsNullOrEmpty(t.ToBankId));

                    if (revDebitTxn == null && revCreditTxn == null && revLegacyTxn != null)
                    {
                        dtos.Add(new CombinedBankTransactionVM
                        {
                            ApprovalId = approvalId,
                            ApprovalName = approvalName + " (Reversed)",
                            ApprovalReference = approvalReference != null ? (approvalReference + " (Reversed)") : null,
                            ApprovalType = approvalType,
                            Amount = revLegacyTxn.Amount,
                            FromBankName = banks.FirstOrDefault(b => b.BankId == revLegacyTxn.FromBankId)?.Name,
                            ToBankName = banks.FirstOrDefault(b => b.BankId == revLegacyTxn.ToBankId)?.Name,
                            CompletedOn = revLegacyTxn.CreatedDate.ToString("o"),
                            RunningBalanceBank1 = revLegacyTxn.RunningBalance != 0 ? revLegacyTxn.RunningBalance : (decimal?)null,
                            RunningBalanceBank2 = null
                        });
                    }
                    else if (revDebitTxn != null || revCreditTxn != null)
                    {
                        var primaryRevTxn = revDebitTxn ?? revCreditTxn;
                        decimal? revRbBank1 = revDebitTxn != null ? (revDebitTxn.RunningBalance != 0 ? revDebitTxn.RunningBalance : CalculateDynamicRunningBalance(transactions, revDebitTxn.FromBankId, revDebitTxn.TransactionId)) : null;
                        decimal? revRbBank2 = revCreditTxn != null ? (revCreditTxn.RunningBalance != 0 ? revCreditTxn.RunningBalance : CalculateDynamicRunningBalance(transactions, revCreditTxn.ToBankId, revCreditTxn.TransactionId)) : null;

                        string resolvedRevFromBankName = null;
                        if (revDebitTxn != null)
                        {
                            resolvedRevFromBankName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == revDebitTxn.FromBankId)?.Name);
                        }
                        else
                        {
                            var debtorId = !string.IsNullOrEmpty(primaryRevTxn.DebtorId) ? primaryRevTxn.DebtorId : approval?.DebtorId;
                            if (!string.IsNullOrEmpty(debtorId))
                            {
                                var debtor = debtors.FirstOrDefault(d => d.DebtorId == debtorId);
                                if (debtor != null)
                                {
                                    resolvedRevFromBankName = "Debtor: " + SafeDecrypt(debtor.Name);
                                }
                            }
                        }

                        string resolvedRevToBankName = null;
                        if (revCreditTxn != null)
                        {
                            resolvedRevToBankName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == revCreditTxn.ToBankId)?.Name);
                        }
                        else
                        {
                            var vendorId = !string.IsNullOrEmpty(primaryRevTxn.VendorId) ? primaryRevTxn.VendorId : approval?.VendorId;
                            if (!string.IsNullOrEmpty(vendorId))
                            {
                                var vendor = vendors.FirstOrDefault(v => v.VendorId == vendorId);
                                if (vendor != null)
                                {
                                    resolvedRevToBankName = "Vendor: " + SafeDecrypt(vendor.Name);
                                }
                            }
                        }

                        dtos.Add(new CombinedBankTransactionVM
                        {
                            ApprovalId = approvalId,
                            ApprovalName = approvalName + " (Reversed)",
                            ApprovalReference = approvalReference != null ? (approvalReference + " (Reversed)") : null,
                            ApprovalType = approvalType,
                            Amount = primaryRevTxn.Amount,
                            FromBankName = resolvedRevFromBankName,
                            ToBankName = resolvedRevToBankName,
                            CompletedOn = primaryRevTxn.CreatedDate.ToString("o"),
                            RunningBalanceBank1 = revRbBank1,
                            RunningBalanceBank2 = revRbBank2
                        });
                    }
                }

                // 3. Process Refund Transactions (if any exist in this group)
                var refundGroup = group.Where(t => t.TransactionType == "Refund").ToList();
                foreach (var refundTx in refundGroup)
                {
                    var distId = !string.IsNullOrEmpty(refundTx.FromBankId) && refundTx.FromBankId.StartsWith("Dstrbtr_") ? refundTx.FromBankId : refundTx.DistributorId;
                    var distObj = distributors.FirstOrDefault(d => d.DistributorId == distId);
                    string distName = distObj != null ? SafeDecrypt(distObj.Name) : "Distributor";
                    string toBankName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == refundTx.ToBankId)?.Name);

                    decimal? rbSourceBank = refundTx.RunningBalance != 0
                        ? refundTx.RunningBalance
                        : CalculateDynamicRunningBalance(transactions, refundTx.ToBankId, refundTx.TransactionId);

                    var distTxForApproval = group.FirstOrDefault(t => (t.ToBankId == distId || (string.IsNullOrEmpty(t.FromBankId) && (t.ToBankId == null || t.ToBankId == distId || t.ToBankId.StartsWith("Dstrbtr_", System.StringComparison.OrdinalIgnoreCase)))) && t.TransactionType != "Refund");
                    decimal totalRefundsForGroup = refundGroup.Sum(x => x.Amount);
                    decimal rbDistributor = 0;
                    if (distTxForApproval != null)
                    {
                        decimal distDep = distTxForApproval.Deposit > 0 ? distTxForApproval.Deposit : distTxForApproval.Amount;
                        decimal distWth = distTxForApproval.Withdrawal;
                        decimal priorDistBal = CalculatePriorDistributorBalance(transactions, distId, distTxForApproval.CreatedDate, approvalId);
                        rbDistributor = Math.Max(0, (priorDistBal + distDep) - (distWth + totalRefundsForGroup));
                    }

                    dtos.Add(new CombinedBankTransactionVM
                    {
                        ApprovalId = approvalId,
                        ApprovalName = approvalName != null ? (approvalName) : "Received from Distributor",
                        ApprovalReference = approvalReference != null ? (approvalReference + " (Refund)") : null,
                        ApprovalType = "Refund",
                        Amount = refundTx.Amount,
                        FromBankName = "Distributor: " + distName,
                        ToBankName = toBankName,
                        CompletedOn = refundTx.CreatedDate.ToString("o"),
                        RunningBalanceBank1 = rbDistributor,
                        RunningBalanceBank2 = rbSourceBank
                    });
                }
            }

            if (!string.IsNullOrWhiteSpace(request.ApprovalType) && !request.ApprovalType.Equals("all", System.StringComparison.OrdinalIgnoreCase))
            {
                dtos = dtos.Where(d => d.ApprovalType != null && d.ApprovalType.Equals(request.ApprovalType, System.StringComparison.OrdinalIgnoreCase)).ToList();
            }

            var response = new GetAllCombinedBankTransactionsQueryResponse
            {
                Success = true,
                Data = dtos.OrderByDescending(d => System.DateTime.Parse(d.CompletedOn)).ToList()
            };

            return response;
        }

        private decimal CalculateDynamicRunningBalance(IReadOnlyList<OOH.Domain.Entities.Global.BankTransaction> allTransactions, string bankId, string upToTransactionId)
        {
            var bankTransactions = allTransactions
                .Where(t => !t.IsVoided && (
                    (t.FromBankId == bankId && (t.IsPaidToDistributor || t.IsConfirm)) ||
                    (t.ToBankId == bankId && (t.IsConfirm || t.TransactionType == "Refund"))
                ))
                .OrderBy(x => x.CreatedDate)
                .ToList();

            decimal runningBalance = 0;
            foreach (var t in bankTransactions)
            {
                bool isWithdrawal = t.FromBankId == bankId;
                bool isDeposit = t.ToBankId == bankId;

                decimal dep = t.Deposit > 0 ? t.Deposit : t.Amount;
                decimal wth = t.Withdrawal > 0 ? t.Withdrawal : t.Amount;

                runningBalance = runningBalance + (isDeposit ? dep : 0) - (isWithdrawal ? wth : 0);

                if (t.TransactionId == upToTransactionId)
                {
                    return runningBalance;
                }
            }
            return runningBalance;
        }

        /// <summary>
        /// Computes the distributor's balance accumulated from prior approvals that occurred before this approval.
        /// </summary>
        private decimal CalculatePriorDistributorBalance(
            IReadOnlyList<OOH.Domain.Entities.Global.BankTransaction> allTransactions,
            string distributorId,
            System.DateTime beforeDate,
            string currentApprovalId)
        {
            var priorDepositRows = allTransactions
                .Where(t => !t.IsVoided &&
                            t.ApprovalId != currentApprovalId &&
                            string.IsNullOrEmpty(t.FromBankId) &&
                            (t.ToBankId == distributorId || (!string.IsNullOrEmpty(t.DistributorId) && t.DistributorId == distributorId && (t.ToBankId == null || t.ToBankId.StartsWith("Dstrbtr_")))) &&
                            t.CreatedDate < beforeDate)
                .ToList();

            decimal balance = 0;
            foreach (var row in priorDepositRows)
            {
                decimal dep = row.Deposit > 0 ? row.Deposit : row.Amount;
                decimal wth = row.Withdrawal; // already contains confirmed amount for that approval

                decimal refunds = allTransactions
                    .Where(t => !t.IsVoided &&
                                t.TransactionType == "Refund" &&
                                t.ApprovalId == row.ApprovalId)
                    .Sum(t => t.Amount);

                decimal netRemaining = Math.Max(0, dep - (wth + refunds));
                balance += netRemaining;
            }

            return balance;
        }

    }
}
