using OOH.Domain.Entities.Global;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OOH.Application.Contracts.Persistence.Global
{
    public interface IDocumentUrlRepository : IAsyncRepository<DocumentUrl>
    {
        Task<List<DocumentUrl>> GetByCategoryAndCategoryIdAsync(string category, string categoryId);
        Task<List<DocumentUrl>> GetByDocTypeAndDocTypeIdAsync(string docType, string docTypeId);
        Task<List<DocumentUrl>> SearchDocumentsAsync(string searchText, string categoryType, string categoryTypeId);
        Task<DocumentUrl> GetByDocumentUrlIdAsync(string id);
    }
}
