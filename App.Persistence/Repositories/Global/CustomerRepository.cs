using Dapper;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Application.Features.Global.Customers.Queries.GetCustomerList;
using OOH.Domain.Entities.Global;

namespace OOH.Persistence.Repositories
{
    public class CustomerRepository : BaseRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



  public async Task<List<CustomerListVM>> ListAllCustomersAsync(string category, string categoryID)
  {
      IEnumerable<CustomerListVM> result;
      try
      {

 
                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()}  FROM Customer";

                query = query + $" where Tenant_Id = @tenantID ";

                query = query + $" and Is_Voided = false ";

                query = query + $" and Category = @category ";

                query = query + $" and Category_Id = @categoryID ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<CustomerListVM>(query, new { tenantID = _dbContext.currentTenantID, category = category, categoryID = categoryID });

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