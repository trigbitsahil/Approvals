using Dapper;
using Microsoft.Extensions.Logging;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOH.Persistence.Repositories.Global
{
    public class DocumentUrlRepository : BaseRepository<DocumentUrl>, IDocumentUrlRepository
    {
        private readonly ILogger<DocumentUrlRepository> _logger;

        public DocumentUrlRepository(DapperDBContext dbContext, ILogger<DocumentUrlRepository> logger) : base(dbContext)
        {
            _logger = logger;
        }

        public async Task<List<DocumentUrl>> GetByCategoryAndCategoryIdAsync(string category, string categoryId)
        {
            try
            {
                using var conn = _dbContext.CreateConnection();
                var query = @"
                    SELECT 
                        document_url_id AS DocumentUrlID,
                        name AS Name,
                        description AS Description,
                        url AS Url,
                        blob_url AS BlobUrl,
                        category AS Category,
                        category_id AS CategoryID,
                        extension AS Extension,
                        content_type AS ContentType,
                        document_file_name AS DocumentFileName,
                        document_type AS DocumentType,
                        document_type_id AS DocumentTypeID,
                        document_date AS DocumentDate,
                        file_size_bytes AS FileSizeBytes,
                        is_hyperlink_and_not_file AS IsHyperlinkAndNotFile,
                        is_voided AS IsVoided,
                        created_by AS CreatedBy,
                        created_date AS CreatedDate,
                        tenant_id AS TenantId
                    FROM document_url
                    WHERE (is_voided = false OR is_voided IS NULL)
                      AND (@Category IS NULL OR @Category = '' OR LOWER(TRIM(category)) = LOWER(TRIM(@Category)))
                      AND (@CategoryId IS NULL OR @CategoryId = '' OR LOWER(TRIM(category_id)) = LOWER(TRIM(@CategoryId)))
                    ORDER BY created_date DESC";

                var result = await conn.QueryAsync<DocumentUrl>(query, new { Category = category, CategoryId = categoryId });
                return result.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting documents by category {Category} and categoryId {CategoryId}", category, categoryId);
                return new List<DocumentUrl>();
            }
        }

        public async Task<List<DocumentUrl>> GetByDocTypeAndDocTypeIdAsync(string docType, string docTypeId)
        {
            try
            {
                using var conn = _dbContext.CreateConnection();
                var query = @"
                    SELECT 
                        document_url_id AS DocumentUrlID,
                        name AS Name,
                        description AS Description,
                        url AS Url,
                        blob_url AS BlobUrl,
                        category AS Category,
                        category_id AS CategoryID,
                        extension AS Extension,
                        content_type AS ContentType,
                        document_file_name AS DocumentFileName,
                        document_type AS DocumentType,
                        document_type_id AS DocumentTypeID,
                        document_date AS DocumentDate,
                        file_size_bytes AS FileSizeBytes,
                        is_hyperlink_and_not_file AS IsHyperlinkAndNotFile,
                        is_voided AS IsVoided,
                        created_by AS CreatedBy,
                        created_date AS CreatedDate,
                        tenant_id AS TenantId
                    FROM document_url
                    WHERE (is_voided = false OR is_voided IS NULL)
                      AND (@DocType IS NULL OR @DocType = '' OR LOWER(TRIM(document_type)) = LOWER(TRIM(@DocType)))
                      AND (@DocTypeId IS NULL OR @DocTypeId = '' OR LOWER(TRIM(document_type_id)) = LOWER(TRIM(@DocTypeId)))
                    ORDER BY created_date DESC";

                var result = await conn.QueryAsync<DocumentUrl>(query, new { DocType = docType, DocTypeId = docTypeId });
                return result.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting documents by docType {DocType} and docTypeId {DocTypeId}", docType, docTypeId);
                return new List<DocumentUrl>();
            }
        }

        public async Task<List<DocumentUrl>> SearchDocumentsAsync(string searchText, string categoryType, string categoryTypeId)
        {
            try
            {
                using var conn = _dbContext.CreateConnection();
                var query = @"
                    SELECT 
                        document_url_id AS DocumentUrlID,
                        name AS Name,
                        description AS Description,
                        url AS Url,
                        blob_url AS BlobUrl,
                        category AS Category,
                        category_id AS CategoryID,
                        extension AS Extension,
                        content_type AS ContentType,
                        document_file_name AS DocumentFileName,
                        document_type AS DocumentType,
                        document_type_id AS DocumentTypeID,
                        document_date AS DocumentDate,
                        file_size_bytes AS FileSizeBytes,
                        is_hyperlink_and_not_file AS IsHyperlinkAndNotFile,
                        is_voided AS IsVoided,
                        created_by AS CreatedBy,
                        created_date AS CreatedDate,
                        tenant_id AS TenantId
                    FROM document_url
                    WHERE (is_voided = false OR is_voided IS NULL)
                      AND (@CategoryType IS NULL OR @CategoryType = '' OR LOWER(TRIM(category)) = LOWER(TRIM(@CategoryType)))
                      AND (@CategoryTypeId IS NULL OR @CategoryTypeId = '' OR LOWER(TRIM(category_id)) = LOWER(TRIM(@CategoryTypeId)))
                      AND (@SearchText IS NULL OR @SearchText = '' OR LOWER(name) LIKE LOWER(@SearchPattern) OR LOWER(description) LIKE LOWER(@SearchPattern))
                    ORDER BY created_date DESC";

                var result = await conn.QueryAsync<DocumentUrl>(query, new {
                    CategoryType = categoryType,
                    CategoryTypeId = categoryTypeId,
                    SearchText = searchText,
                    SearchPattern = $"%{searchText}%"
                });
                return result.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching document_url");
                return new List<DocumentUrl>();
            }
        }

        public async Task<DocumentUrl?> GetByDocumentUrlIdAsync(string id)
        {
            try
            {
                using var conn = _dbContext.CreateConnection();
                var query = @"
                    SELECT 
                        document_url_id AS DocumentUrlID,
                        name AS Name,
                        description AS Description,
                        url AS Url,
                        blob_url AS BlobUrl,
                        category AS Category,
                        category_id AS CategoryID,
                        extension AS Extension,
                        content_type AS ContentType,
                        document_file_name AS DocumentFileName,
                        document_type AS DocumentType,
                        document_type_id AS DocumentTypeID,
                        document_date AS DocumentDate,
                        file_size_bytes AS FileSizeBytes,
                        is_hyperlink_and_not_file AS IsHyperlinkAndNotFile,
                        is_voided AS IsVoided,
                        created_by AS CreatedBy,
                        created_date AS CreatedDate,
                        tenant_id AS TenantId
                    FROM document_url
                    WHERE (is_voided = false OR is_voided IS NULL) AND document_url_id = @Id";

                return await conn.QueryFirstOrDefaultAsync<DocumentUrl>(query, new { Id = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting document_url by id {Id}", id);
                return null;
            }
        }
    }
}
