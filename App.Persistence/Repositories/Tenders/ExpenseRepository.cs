using Dapper;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseList;
using OOH.Domain.Entities.Tenders;

namespace OOH.Persistence.Repositories.Tenders
{
    public class ExpenseRepository : BaseRepository<Expense>, IExpenseRepository
    {
        public ExpenseRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



        public async Task<List<ExpenseListVM>> ListAllExpensesAsync(string expenseTypeID = null)
        {
            IEnumerable<ExpenseListVM> result;
            try
            {


                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()} ,expense.name as ExpenseName, expense_type.name as ExpenseTypeName , expense_category.name as ExpenseCategoryName  FROM Expense";

                query = query + $" join expense_type on expense_type.expense_type_id = expense.expense_type_id ";

                query = query + $" join expense_category on expense_category.expense_category_id = expense_type.expense_category_id ";

                query = query + $" where Expense.Tenant_ID = @tenantID ";

                query = query + $" and Expense.Is_Voided = false ";

                if (!string.IsNullOrEmpty(expenseTypeID))
                {
                    query = query + $" and Expense.Expense_Type_ID = @expenseTypeID ";


                }



                using (var dbConn = _dbContext.CreateConnection())
                {
                    if (!string.IsNullOrEmpty(expenseTypeID))
                    {
                        result = await dbConn.QueryAsync<ExpenseListVM>(query, new { tenantID = _dbContext.currentTenantID, expenseTypeID });
                    }
                    else
                    {

                        result = await dbConn.QueryAsync<ExpenseListVM>(query, new { tenantID = _dbContext.currentTenantID });

                    }

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