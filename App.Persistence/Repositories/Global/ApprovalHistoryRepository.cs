using Dapper;
using Microsoft.Extensions.Logging;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOH.Persistence.Repositories
{
    public class ApprovalHistoryRepository : BaseRepository<ApprovalHistory>, IApprovalHistoryRepository
    {
        private readonly ILogger<ApprovalHistoryRepository> _logger;

        public ApprovalHistoryRepository(DapperDBContext dbContext, ILogger<ApprovalHistoryRepository> logger) : base(dbContext)
        {
            _logger = logger;
        }

        public async Task<List<ApprovalHistory>> GetByApprovalIdAsync(string approvalId)
        {
            try
            {
                using var conn = _dbContext.CreateConnection();
                var query = @"
                    SELECT 
                        history_id AS HistoryId,
                        approval_id AS ApprovalId,
                        action AS Action,
                        description AS Description,
                        performed_by AS PerformedBy,
                        performed_by_name AS PerformedByName,
                        remarks AS Remarks,
                        is_voided AS IsVoided,
                        created_by AS CreatedBy,
                        created_date AS CreatedDate,
                        tenant_id AS TenantId
                    FROM approval_history
                    WHERE LOWER(TRIM(approval_id)) = LOWER(TRIM(@ApprovalId))
                    ORDER BY created_date ASC";

                var result = await conn.QueryAsync<ApprovalHistory>(query, new
                {
                    ApprovalId = approvalId
                });

                return result.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting approval history for approval {ApprovalId}", approvalId);
                return new List<ApprovalHistory>();
            }
        }

        public async Task LogHistoryAsync(string approvalId, string action, string description, string performedBy = null, string performedByName = null, string remarks = null)
        {
            try
            {
                if (string.IsNullOrEmpty(approvalId)) return;

                var history = new ApprovalHistory
                {
                    HistoryId = Guid.NewGuid().ToString(),
                    ApprovalId = approvalId,
                    Action = action,
                    Description = description,
                    PerformedBy = performedBy ?? "System",
                    PerformedByName = performedByName ?? performedBy ?? "System",
                    Remarks = remarks,
                    IsVoided = false,
                    CreatedBy = performedBy ?? "System",
                    CreatedDate = DateTime.UtcNow,
                    TenantId = _dbContext.currentTenantID ?? "1"
                };

                using var conn = _dbContext.CreateConnection();
                var query = @"
                    INSERT INTO approval_history (
                        history_id, approval_id, action, description, performed_by, performed_by_name, remarks, is_voided, created_by, created_date, tenant_id
                    ) VALUES (
                        @HistoryId, @ApprovalId, @Action, @Description, @PerformedBy, @PerformedByName, @Remarks, @IsVoided, @CreatedBy, @CreatedDate, @TenantId
                    )";

                await conn.ExecuteAsync(query, history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging approval history for approval {ApprovalId}", approvalId);
            }
        }
    }
}
