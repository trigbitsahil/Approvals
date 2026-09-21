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

                // 2. Cascade delete dependent child records
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
