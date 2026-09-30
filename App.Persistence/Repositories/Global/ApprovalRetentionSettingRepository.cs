using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;

namespace OOH.Persistence.Repositories.Global
{
    public class ApprovalRetentionSettingRepository : BaseRepository<ApprovalRetentionSetting>, IApprovalRetentionSettingRepository
    {
        public ApprovalRetentionSettingRepository(DapperDBContext dbContext) : base(dbContext)
        {
        }

        public async Task<ApprovalRetentionSetting?> GetActiveSettingAsync(string? tenantId = null)
        {
            try
            {
                string targetTenant = !string.IsNullOrEmpty(tenantId) ? tenantId : _dbContext.currentTenantID;

                string query = @"SELECT setting_id AS SettingId, 
                                       retention_days AS RetentionDays, 
                                       is_active AS IsActive, 
                                       tenant_id AS TenantId, 
                                       is_voided AS IsVoided, 
                                       created_by AS CreatedBy, 
                                       created_date AS CreatedDate, 
                                       last_modified_by AS LastModifiedBy, 
                                       last_modified_date AS LastModifiedDate 
                                FROM approval_retention_setting 
                                WHERE is_voided = false AND is_active = true";

                if (!string.IsNullOrEmpty(targetTenant))
                {
                    query += " AND (tenant_id = @targetTenant OR tenant_id = 'TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3')";
                }

                query += " ORDER BY last_modified_date DESC NULLS LAST, created_date DESC LIMIT 1;";

                using var dbConn = _dbContext.CreateConnection();
                var result = await dbConn.QueryFirstOrDefaultAsync<ApprovalRetentionSetting>(query, new { targetTenant });
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading approval retention setting: {ex.Message}");
                return null;
            }
        }

        public async Task<(int deletedApprovals, int deletedTransactions)> PurgeExpiredApprovalsAsync(int retentionDays, string? tenantId = null)
        {
            DateTime cutoff = DateTime.UtcNow.AddDays(-retentionDays);
            string targetTenant = !string.IsNullOrEmpty(tenantId) ? tenantId : _dbContext.currentTenantID;

            using var dbConn = _dbContext.CreateConnection();
            if (dbConn.State != ConnectionState.Open)
            {
                dbConn.Open();
            }

            using var trans = dbConn.BeginTransaction();
            try
            {
                // 1. Identify expired approval IDs based on created_date
                string selectQuery = @"SELECT approval_id 
                                       FROM approval 
                                       WHERE created_date < @cutoff 
                                         AND is_voided = false";

                if (!string.IsNullOrEmpty(targetTenant))
                {
                    selectQuery += " AND (tenant_id = @targetTenant OR tenant_id = 'TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3')";
                }
                selectQuery += ";";

                var approvalIds = (await dbConn.QueryAsync<string>(selectQuery, new { cutoff, targetTenant }, trans)).ToList();

                if (approvalIds.Count == 0)
                {
                    trans.Commit();
                    return (0, 0);
                }

                var idsArray = approvalIds.ToArray();

                // 2. Determine and accumulate amounts for bank transactions going to be deleted
                string selectTxQuery = @"
                    SELECT transaction_id AS TransactionId,
                           approval_id AS ApprovalId,
                           from_bank_id AS FromBankId,
                           to_bank_id AS ToBankId,
                           vendor_id AS VendorId,
                           debtor_id AS DebtorId,
                           distributor_id AS DistributorId,
                           transaction_type AS TransactionType,
                           amount AS Amount,
                           deposit AS Deposit,
                           withdrawal AS Withdrawal,
                           running_balance AS RunningBalance,
                           is_paid_to_distributor AS IsPaidToDistributor,
                           is_confirm AS IsConfirm,
                           tenant_id AS TenantId
                    FROM bank_transactions
                    WHERE approval_id = ANY(@idsArray) AND is_voided = false;";

                var txsToDelete = (await dbConn.QueryAsync<BankTransaction>(selectTxQuery, new { idsArray }, trans)).ToList();

                string selectApprovalQuery = @"
                    SELECT approval_id AS ApprovalId,
                           from_bank_id AS FromBankId,
                           to_bank_id AS ToBankId,
                           vendor_id AS VendorId,
                           debtor_id AS DebtorId,
                           distributor_id AS DistributorId,
                           transaction_amount AS TransactionAmount,
                           tenant_id AS TenantId
                    FROM approval
                    WHERE approval_id = ANY(@idsArray);";

                var approvalsToDelete = (await dbConn.QueryAsync<Approval>(selectApprovalQuery, new { idsArray }, trans)).ToList();
                var approvalMap = approvalsToDelete.ToDictionary(a => a.ApprovalId);

                var entityDeltas = new Dictionary<(string ApprovalId, string EntityId, string TenantId, string EntityType), (decimal Deposits, decimal Withdrawals, decimal RunningBalance)>();

                // 1. Bank metrics from transactions
                foreach (var tx in txsToDelete)
                {
                    string txTenant = !string.IsNullOrEmpty(tx.TenantId) ? tx.TenantId : targetTenant;
                    string apprlId = !string.IsNullOrEmpty(tx.ApprovalId) ? tx.ApprovalId : "-";

                    // FromBank: Money goes out (withdrawal) - exclude distributor virtual bank
                    if (!string.IsNullOrEmpty(tx.FromBankId) && tx.FromBankId != "-" && !tx.FromBankId.StartsWith("Dstrbtr_") && (tx.IsPaidToDistributor || tx.IsConfirm))
                    {
                        decimal wth = tx.Withdrawal > 0 ? tx.Withdrawal : tx.Amount;
                        var key = (apprlId, tx.FromBankId, txTenant, "Bank");
                        if (!entityDeltas.ContainsKey(key)) entityDeltas[key] = (0, 0, 0);
                        var current = entityDeltas[key];
                        entityDeltas[key] = (current.Deposits, current.Withdrawals + wth, current.RunningBalance - wth);
                    }

                    // ToBank: Money comes in (deposit) - exclude distributor virtual bank
                    if (!string.IsNullOrEmpty(tx.ToBankId) && tx.ToBankId != "-" && !tx.ToBankId.StartsWith("Dstrbtr_") && (tx.IsConfirm || tx.TransactionType == "Refund"))
                    {
                        decimal dep = tx.Deposit > 0 ? tx.Deposit : tx.Amount;
                        var key = (apprlId, tx.ToBankId, txTenant, "Bank");
                        if (!entityDeltas.ContainsKey(key)) entityDeltas[key] = (0, 0, 0);
                        var current = entityDeltas[key];
                        entityDeltas[key] = (current.Deposits + dep, current.Withdrawals, current.RunningBalance + dep);
                    }
                }

                // Group transactions by ApprovalId for Distributor, Vendor, and Debtor calculations
                var txsByApproval = txsToDelete.GroupBy(t => !string.IsNullOrEmpty(t.ApprovalId) ? t.ApprovalId : "-").ToList();

                foreach (var g in txsByApproval)
                {
                    string apprlId = g.Key;
                    approvalMap.TryGetValue(apprlId, out var app);
                    string txTenant = g.FirstOrDefault()?.TenantId ?? app?.TenantId ?? targetTenant;

                    // 2. Distributor metrics
                    string distId = g.Select(t => t.DistributorId).FirstOrDefault(id => !string.IsNullOrEmpty(id))
                                    ?? app?.DistributorId
                                    ?? g.Select(t => t.ToBankId).FirstOrDefault(id => !string.IsNullOrEmpty(id) && id.StartsWith("Dstrbtr_"))
                                    ?? g.Select(t => t.FromBankId).FirstOrDefault(id => !string.IsNullOrEmpty(id) && id.StartsWith("Dstrbtr_"));

                    if (!string.IsNullOrEmpty(distId))
                    {
                        var depTx = g.FirstOrDefault(t => (t.ToBankId == distId || (string.IsNullOrEmpty(t.FromBankId) && (t.ToBankId == null || t.ToBankId == distId || t.ToBankId.StartsWith("Dstrbtr_", StringComparison.OrdinalIgnoreCase)))) && t.TransactionType != "Refund" && t.Deposit > 0)
                                    ?? g.FirstOrDefault(t => t.TransactionType != "Refund");

                        decimal depAmt = depTx?.Deposit > 0 ? depTx.Deposit : (depTx?.Amount ?? 0);
                        decimal confSpent = (depTx != null && depTx.IsConfirm) ? depTx.Withdrawal : 0;
                        decimal refundAmt = g.Where(t => t.TransactionType == "Refund" || t.FromBankId == distId).Sum(t => t.Amount);

                        decimal effectiveWithdrawn = Math.Max(depTx?.Withdrawal ?? 0, confSpent + refundAmt);
                        if (depAmt > 0 && effectiveWithdrawn > depAmt)
                        {
                            effectiveWithdrawn = depAmt;
                        }

                        var key = (apprlId, distId, txTenant, "Distributor");
                        decimal netRb = Math.Max(0, depAmt - effectiveWithdrawn);
                        entityDeltas[key] = (depAmt, effectiveWithdrawn, netRb);
                    }

                    // 3. Vendor metrics
                    string vendorId = g.Select(t => t.VendorId).FirstOrDefault(id => !string.IsNullOrEmpty(id)) ?? app?.VendorId;
                    if (!string.IsNullOrEmpty(vendorId))
                    {
                        var primaryVendorTx = g.Where(t => (t.VendorId == vendorId || app?.VendorId == vendorId) && !t.IsVoided)
                                               .OrderByDescending(t => !string.IsNullOrEmpty(t.FromBankId))
                                               .ThenByDescending(t => t.CreatedDate)
                                               .FirstOrDefault();

                        bool isConfirmed = (primaryVendorTx != null && primaryVendorTx.IsConfirm) || g.Any(t => t.IsConfirm);
                        if (isConfirmed)
                        {
                            decimal vendorPaid = (primaryVendorTx?.Withdrawal > 0 && primaryVendorTx.IsPartialAmount)
                                ? primaryVendorTx.Withdrawal
                                : (primaryVendorTx?.Amount > 0 ? primaryVendorTx.Amount : (app?.TransactionAmount ?? 0));

                            if (vendorPaid > 0)
                            {
                                var key = (apprlId, vendorId, txTenant, "Vendor");
                                entityDeltas[key] = (0, vendorPaid, vendorPaid);
                            }
                        }
                    }

                    // 4. Debtor metrics
                    string debtorId = g.Select(t => t.DebtorId).FirstOrDefault(id => !string.IsNullOrEmpty(id)) ?? app?.DebtorId;
                    if (!string.IsNullOrEmpty(debtorId))
                    {
                        var primaryDebtorTx = g.Where(t => (t.DebtorId == debtorId || app?.DebtorId == debtorId) && !t.IsVoided)
                                               .OrderByDescending(t => !string.IsNullOrEmpty(t.FromBankId))
                                               .ThenByDescending(t => t.CreatedDate)
                                               .FirstOrDefault();

                        decimal debtorAmt = primaryDebtorTx?.Amount > 0 ? primaryDebtorTx.Amount : (app?.TransactionAmount ?? 0);
                        bool isSettled = (primaryDebtorTx != null && primaryDebtorTx.IsConfirm) || g.Any(t => t.IsConfirm);
                        decimal settledAmt = isSettled
                            ? ((primaryDebtorTx?.Deposit > 0 && primaryDebtorTx.IsPartialAmount) ? primaryDebtorTx.Deposit : debtorAmt)
                            : 0;

                        if (debtorAmt > 0 || settledAmt > 0)
                        {
                            var key = (apprlId, debtorId, txTenant, "Debtor");
                            entityDeltas[key] = (settledAmt, 0, debtorAmt);
                        }
                    }
                }

                // Store accumulated amounts into bank_retention_balance table
                foreach (var kvp in entityDeltas)
                {
                    string aId = kvp.Key.ApprovalId;
                    string eId = kvp.Key.EntityId;
                    string bTenant = kvp.Key.TenantId;
                    string eType = kvp.Key.EntityType;
                    decimal depToAdd = kvp.Value.Deposits;
                    decimal wthToAdd = kvp.Value.Withdrawals;
                    decimal rbDelta = kvp.Value.RunningBalance;

                    string checkQuery = @"
                        SELECT id FROM bank_retention_balance 
                        WHERE approval_id = @aId 
                          AND bank_id = @eId 
                          AND tenant_id = @bTenant 
                          AND entity_type = @eType 
                        LIMIT 1;";
                    var existingId = await dbConn.QueryFirstOrDefaultAsync<string>(checkQuery, new { aId, eId, bTenant, eType }, trans);

                    if (!string.IsNullOrEmpty(existingId))
                    {
                        string updateQuery = @"
                            UPDATE bank_retention_balance 
                            SET total_deposit = total_deposit + @depToAdd,
                                total_withdrawal = total_withdrawal + @wthToAdd,
                                running_balance = running_balance + @rbDelta,
                                last_modified_by = 'System',
                                last_modified_date = (NOW() AT TIME ZONE 'utc')
                            WHERE id = @existingId;";

                        await dbConn.ExecuteAsync(updateQuery, new { existingId, depToAdd, wthToAdd, rbDelta }, trans);
                    }
                    else
                    {
                        string insertQuery = @"
                            INSERT INTO bank_retention_balance (
                                id, approval_id, bank_id, entity_type, total_deposit, total_withdrawal, running_balance, tenant_id, is_voided, created_by, created_date, last_modified_by, last_modified_date
                            ) VALUES (
                                @id, @aId, @eId, @eType, @depToAdd, @wthToAdd, @rbDelta, @bTenant, false, 'System', (NOW() AT TIME ZONE 'utc'), 'System', (NOW() AT TIME ZONE 'utc')
                            );";

                        await dbConn.ExecuteAsync(insertQuery, new {
                            id = Guid.NewGuid().ToString(),
                            aId,
                            eId,
                            eType,
                            depToAdd,
                            wthToAdd,
                            rbDelta,
                            bTenant
                        }, trans);
                    }
                }

                // 3. Cascade delete dependent child records
                // a) Delete related bank_transactions
                int deletedTransactions = await dbConn.ExecuteAsync(
                    "DELETE FROM bank_transactions WHERE approval_id = ANY(@idsArray);",
                    new { idsArray }, trans);

                // b) Delete related approval_approver
                await dbConn.ExecuteAsync(
                    "DELETE FROM approval_approver WHERE approval_id = ANY(@idsArray);",
                    new { idsArray }, trans);

                // c) Delete related approval_comment
                await dbConn.ExecuteAsync(
                    "DELETE FROM approval_comment WHERE approval_id = ANY(@idsArray);",
                    new { idsArray }, trans);

                // d) Delete related approval_history
                await dbConn.ExecuteAsync(
                    "DELETE FROM approval_history WHERE approval_id = ANY(@idsArray);",
                    new { idsArray }, trans);

                // e) Delete related approval_media
                await dbConn.ExecuteAsync(
                    "DELETE FROM approval_media WHERE approval_id = ANY(@idsArray);",
                    new { idsArray }, trans);

                // f) Delete related document_url
                await dbConn.ExecuteAsync(
                    "DELETE FROM document_url WHERE category = 'Approval' AND category_id = ANY(@idsArray);",
                    new { idsArray }, trans);

                // g) Delete primary approval records
                int deletedApprovals = await dbConn.ExecuteAsync(
                    "DELETE FROM approval WHERE approval_id = ANY(@idsArray);",
                    new { idsArray }, trans);

                trans.Commit();
                return (deletedApprovals, deletedTransactions);
            }
            catch (Exception ex)
            {
                trans.Rollback();
                Console.WriteLine($"Error purging expired approvals: {ex.Message}");
                throw;
            }
        }
    }
}
