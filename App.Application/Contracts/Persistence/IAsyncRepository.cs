using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Contracts.Persistence
{
    public interface IAsyncRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(string id);
        Task<T?> GetByIdForUpdateAsync(string id);
        Task<T?> GetByIdAsync2(string id);

        Task<List<T>> ListAllAsync();
 
        Task<int> AddAsync(T entity);

        Task<int> AddAsync2(T entity);
        Task<int> UpdateAsync(T entity);
        Task<int> DeleteAsync(T entity);
        Task<int> VoidAsync(T entity);
        Task ClearTableAsync();
        Task<int> CountAllAsync();

        Task<int> UpdateRelatedDocumentDate(string documentType, string documentTypeId, DateTime DocumentDate);

        Task<string> GetUserDepartment();

   


        //Task<IReadOnlyList<T>> GetPagedReponseAsync(int page, int size);
    }
}
