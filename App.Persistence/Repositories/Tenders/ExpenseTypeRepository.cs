using Dapper;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Features.Tenders.ExpenseTypes.Queries.GetExpenseTypeList;
using OOH.Domain.Entities.Tenders;

namespace OOH.Persistence.Repositories.Tenders
{
    public class ExpenseTypeRepository : BaseRepository<ExpenseType>, IExpenseTypeRepository
    {
        public ExpenseTypeRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



        public async Task<List<ExpenseTypeListVM>> ListAllExpenseTypesAsync( )
        {
            IEnumerable<ExpenseTypeListVM> result;
            try
            {


                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()}, Expense_Category.Name as ExpenseCategoryName  FROM Expense_Type";

                query = query + $" join Expense_Category on  Expense_Category.Expense_Category_ID = Expense_Type.Expense_Category_ID ";


                query = query + $" where Expense_Type.Tenant_ID = @tenantID ";

                query = query + $" and Expense_Type.Is_Voided = false ";
 



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ExpenseTypeListVM>(query, new { tenantID = _dbContext.currentTenantID  });

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