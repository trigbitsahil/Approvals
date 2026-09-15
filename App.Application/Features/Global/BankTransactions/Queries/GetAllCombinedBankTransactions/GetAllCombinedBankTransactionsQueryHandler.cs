using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetAllCombinedBankTransactions
{
    public class GetAllCombinedBankTransactionsQueryHandler : IRequestHandler<GetAllCombinedBankTransactionsQuery, GetAllCombinedBankTransactionsQueryResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly IVendorRepository _vendorRepository;
        private readonly IDebtorRepository _debtorRepository;
        private readonly OOH.Application.Contracts.Infrastructure.IEncryptionService _encryptionService;

        public GetAllCombinedBankTransactionsQueryHandler(
            IBankTransactionRepository bankTransactionRepository,
            IBankRepository bankRepository,
            IApprovalRepository approvalRepository,
            IVendorRepository vendorRepository,
            IDebtorRepository debtorRepository,
            OOH.Application.Contracts.Infrastructure.IEncryptionService encryptionService)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _approvalRepository = approvalRepository;
            _vendorRepository = vendorRepository;
            _debtorRepository = debtorRepository;
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

                // 1. Process Original Transactions (exclude Reversals)
                var activeGroup = group.Where(t => t.TransactionType != "Reversal").ToList();
                
                var debitTxn = activeGroup.OrderBy(t => t.CreatedDate).FirstOrDefault(t => !string.IsNullOrEmpty(t.FromBankId) && string.IsNullOrEmpty(t.ToBankId));
                var creditTxn = activeGroup.OrderBy(t => t.CreatedDate).FirstOrDefault(t => string.IsNullOrEmpty(t.FromBankId) && !string.IsNullOrEmpty(t.ToBankId));
                var legacyTxn = activeGroup.FirstOrDefault(t => !string.IsNullOrEmpty(t.FromBankId) && !string.IsNullOrEmpty(t.ToBankId));

                if (debitTxn == null && creditTxn == null && legacyTxn != null)
                {
                    dtos.Add(new CombinedBankTransactionVM
                    {
                        ApprovalId = approvalId,
                        ApprovalName = approvalName,
                        ApprovalReference = approvalReference,
                        ApprovalType = approvalType,
                        Amount = legacyTxn.Amount,
                        FromBankName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == legacyTxn.FromBankId)?.Name),
                        ToBankName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == legacyTxn.ToBankId)?.Name),
                        CompletedOn = legacyTxn.CreatedDate.ToString("o"),
                        RunningBalanceBank1 = legacyTxn.RunningBalance != 0 ? legacyTxn.RunningBalance : (decimal?)null,
                        RunningBalanceBank2 = null
                    });
                }
                else if (debitTxn != null || creditTxn != null)
                {
                    var primaryTxn = debitTxn ?? creditTxn;
                    decimal? rbBank1 = debitTxn != null ? (debitTxn.RunningBalance != 0 ? debitTxn.RunningBalance : CalculateDynamicRunningBalance(transactions, debitTxn.FromBankId, debitTxn.TransactionId)) : null;
                    decimal? rbBank2 = creditTxn != null ? ((creditTxn.IsConfirm && creditTxn.RunningBalance != 0) ? creditTxn.RunningBalance : CalculateDynamicRunningBalance(transactions, creditTxn.ToBankId, creditTxn.TransactionId)) : null;

                    string resolvedFromBankName = null;
                    if (debitTxn != null)
                    {
                        resolvedFromBankName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == debitTxn.FromBankId)?.Name);
                    }
                    else
                    {
                        var debtorId = !string.IsNullOrEmpty(primaryTxn.DebtorId) ? primaryTxn.DebtorId : approval?.DebtorId;
                        if (!string.IsNullOrEmpty(debtorId))
                        {
                            var debtor = debtors.FirstOrDefault(d => d.DebtorId == debtorId);
                            if (debtor != null)
                            {
                                resolvedFromBankName = "Debtor: " + SafeDecrypt(debtor.Name);
                            }
                        }
                    }

                    string resolvedToBankName = null;
                    if (creditTxn != null)
                    {
                        resolvedToBankName = SafeDecrypt(banks.FirstOrDefault(b => b.BankId == creditTxn.ToBankId)?.Name);
                    }
                    else
                    {
                        var vendorId = !string.IsNullOrEmpty(primaryTxn.VendorId) ? primaryTxn.VendorId : approval?.VendorId;
                        if (!string.IsNullOrEmpty(vendorId))
                        {
                            var vendor = vendors.FirstOrDefault(v => v.VendorId == vendorId);
                            if (vendor != null)
                            {
                                resolvedToBankName = "Vendor: " + SafeDecrypt(vendor.Name);
                            }
                        }
                    }

                    dtos.Add(new CombinedBankTransactionVM
                    {
                        ApprovalId = approvalId,
                        ApprovalName = approvalName,
                        ApprovalReference = approvalReference,
                        ApprovalType = approvalType,
                        Amount = primaryTxn.Amount,
                        FromBankName = resolvedFromBankName,
                        ToBankName = resolvedToBankName,
                        CompletedOn = primaryTxn.CreatedDate.ToString("o"),
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
                    (t.ToBankId == bankId && t.IsConfirm)
                ))
                .OrderBy(x => x.CreatedDate)
                .ToList();

            decimal runningBalance = 0;
            foreach (var t in bankTransactions)
            {
                bool isWithdrawal = t.FromBankId == bankId;
                bool isDeposit = t.ToBankId == bankId;
                runningBalance = runningBalance + (isDeposit ? t.Amount : 0) - (isWithdrawal ? t.Amount : 0);
                
                if (t.TransactionId == upToTransactionId)
                {
                    return runningBalance;
                }
            }
            return runningBalance;
        }

    }
}
