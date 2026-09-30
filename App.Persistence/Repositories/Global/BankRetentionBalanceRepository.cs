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
    public class BankRetentionBalanceRepository : BaseRepository<BankRetentionBalance>, IBankRetentionBalanceRepository
    {
        public BankRetentionBalanceRepository(DapperDBContext dbContext) : base(dbContext)
        {
        }

        public async Task<BankRetentionBalance?> GetByBankIdAsync(string bankId, string? tenantId = null, string? entityType = null)
        {
            try
            {
                string targetTenant = !string.IsNullOrEmpty(tenantId) ? tenantId : _dbContext.currentTenantID;

                string query = @"SELECT bank_id AS BankId, 
                                       COALESCE(SUM(total_deposit), 0) AS TotalDeposit, 
                                       COALESCE(SUM(total_withdrawal), 0) AS TotalWithdrawal, 
                                       COALESCE(SUM(running_balance), 0) AS RunningBalance 
                                FROM bank_retention_balance 
                                WHERE bank_id = @bankId";

                if (!string.IsNullOrEmpty(targetTenant))
                {
                    query += " AND (tenant_id = @targetTenant OR tenant_id = 'TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3')";
                }

                if (!string.IsNullOrEmpty(entityType))
                {
                    query += " AND entity_type = @entityType";
                }

                query += " GROUP BY bank_id LIMIT 1;";

                using var dbConn = _dbContext.CreateConnection();
                var result = await dbConn.QueryFirstOrDefaultAsync<BankRetentionBalance>(query, new { bankId, targetTenant, entityType });
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading bank_retention_balance for bank {bankId}: {ex.Message}");
                return null;
            }
        }

        public async Task<List<BankRetentionBalance>> GetAllRetentionBalancesAsync(string? tenantId = null, string? entityType = null)
        {
            try
            {
                string targetTenant = !string.IsNullOrEmpty(tenantId) ? tenantId : _dbContext.currentTenantID;

                string query = @"SELECT bank_id AS BankId, 
                                       COALESCE(SUM(total_deposit), 0) AS TotalDeposit, 
                                       COALESCE(SUM(total_withdrawal), 0) AS TotalWithdrawal, 
                                       COALESCE(SUM(running_balance), 0) AS RunningBalance 
                                FROM bank_retention_balance";

                bool hasWhere = false;
                if (!string.IsNullOrEmpty(targetTenant))
                {
                    query += " WHERE (tenant_id = @targetTenant OR tenant_id = 'TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3')";
                    hasWhere = true;
                }

                if (!string.IsNullOrEmpty(entityType))
                {
                    query += (hasWhere ? " AND" : " WHERE") + " entity_type = @entityType";
                }

                query += " GROUP BY bank_id;";

                using var dbConn = _dbContext.CreateConnection();
                var result = await dbConn.QueryAsync<BankRetentionBalance>(query, new { targetTenant, entityType });
                return result.ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading all bank_retention_balance: {ex.Message}");
                return new List<BankRetentionBalance>();
            }
        }

        public async Task AccumulateRetentionBalanceAsync(string bankId, decimal deposit, decimal withdrawal, string tenantId, string? approvalId = null, string? entityType = "Bank")
        {
            try
            {
                string targetTenant = !string.IsNullOrEmpty(tenantId) ? tenantId : _dbContext.currentTenantID;
                string type = !string.IsNullOrEmpty(entityType) ? entityType : "Bank";
                decimal netChange = deposit - withdrawal;

                using var dbConn = _dbContext.CreateConnection();
                string checkQuery = @"
                    SELECT id FROM bank_retention_balance 
                    WHERE bank_id = @bankId 
                      AND tenant_id = @targetTenant 
                      AND entity_type = @type
                      AND ((@approvalId IS NULL AND approval_id IS NULL) OR approval_id = @approvalId) 
                    LIMIT 1;";
                var existingId = await dbConn.QueryFirstOrDefaultAsync<string>(checkQuery, new { bankId, targetTenant, approvalId, type });

                if (!string.IsNullOrEmpty(existingId))
                {
                    string updateQuery = @"
                        UPDATE bank_retention_balance 
                        SET total_deposit = total_deposit + @deposit,
                            total_withdrawal = total_withdrawal + @withdrawal,
                            running_balance = running_balance + @netChange,
                            last_modified_date = (NOW() AT TIME ZONE 'utc')
                        WHERE id = @existingId;";

                    await dbConn.ExecuteAsync(updateQuery, new { existingId, deposit, withdrawal, netChange });
                }
                else
                {
                    string insertQuery = @"
                        INSERT INTO bank_retention_balance (
                            id, approval_id, bank_id, entity_type, total_deposit, total_withdrawal, running_balance, tenant_id, created_date, last_modified_date
                        ) VALUES (
                            @id, @approvalId, @bankId, @type, @deposit, @withdrawal, @netChange, @targetTenant, (NOW() AT TIME ZONE 'utc'), (NOW() AT TIME ZONE 'utc')
                        );";

                    await dbConn.ExecuteAsync(insertQuery, new {
                        id = Guid.NewGuid().ToString(),
                        approvalId,
                        bankId,
                        type,
                        deposit,
                        withdrawal,
                        netChange,
                        targetTenant
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error accumulating bank_retention_balance for bank {bankId}: {ex.Message}");
                throw;
            }
        }
    }
}
