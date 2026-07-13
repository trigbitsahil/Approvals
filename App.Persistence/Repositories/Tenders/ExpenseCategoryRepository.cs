using Dapper;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Features.Tenders.ExpenseCategorys.Queries.GetExpenseCategoryList;
using OOH.Domain.Entities;
using OOH.Domain.Entities.Tenders;

namespace OOH.Persistence.Repositories
{
    public class ExpenseCategoryRepository : BaseRepository<ExpenseCategory>, IExpenseCategoryRepository
    {
        public ExpenseCategoryRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



  public async Task<List<ExpenseCategoryListVM>> ListAllExpenseCategorysAsync(string category, string categoryID)
  {
      IEnumerable<ExpenseCategoryListVM> result;
      try
      {

 
                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()}  FROM ExpenseCategory";

                query = query + $" where Tenant_Id = @tenantID ";

                query = query + $" and Is_Voided = false ";

                query = query + $" and Category = @category ";

                query = query + $" and Category_Id = @categoryID ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ExpenseCategoryListVM>(query, new { tenantID = _dbContext.currentTenantID, category = category, categoryID = categoryID });

                }
 


      }
      catch (Exception ex)
      {
          Console.WriteLine($"Error fetching records from db: ${ex.Message}");
          throw new Exception("Unable to fetch data. Please contact the administrator.");
      }

      return result.ToList();
  }



    }
}