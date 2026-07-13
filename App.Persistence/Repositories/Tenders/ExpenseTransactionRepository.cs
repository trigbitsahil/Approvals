using Dapper;
using OOH.Application.Contracts.Persistence.Tenders;
 
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList2;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListByVendor;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListForApproval;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionSearch;
 
using OOH.Domain.Entities.Global;
using OOH.Domain.Entities.Tenders;
using System.Diagnostics.Contracts;
using System.Globalization;
using System.Numerics;

namespace OOH.Persistence.Repositories.Tenders
{
    public class ExpenseTransactionRepository : BaseRepository<ExpenseTransaction>, IExpenseTransactionRepository
    {
        public ExpenseTransactionRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



        public async Task<List<ExpenseTransactionListVM>> ListAllExpenseTransactionsAsync(string category, string categoryID)
        {
            IEnumerable<ExpenseTransactionListVM> result;
            try
            {


                string query = $" SELECT budget.name as budgetName,    approval.media_id  as MediaId,     {GetColumnsAsPropertiesWithTableName()} ";



                if (category == "Contract")
                {
                    query = query + $" ,  contract_Media_Unit.name as MediaName   ";

                }
                else if (category == "Tender")
                {

                    query = query + $" ,  Tender_Media_Unit.name as MediaName   ";

                }
                else if (category == "Project")
                {
                    query = query + $"  ";

                }
                else
                {
                    query = query + $" ,  proposal_Media_Unit.name as MediaName   ";

                }

 


                query = query + $" FROM Expense_Transaction";


                query = query + $" left join budget on budget.budget_id = expense_transaction.budget_id ";


                query = query + $" join  approval on  expense_transaction.expense_transaction_id= approval.approval_type_id ";



                if (category == "Contract")
                {
                    query = query + $" left join contract_Media_Unit on contract_Media_Unit.contract_media_unit_id = approval.media_id  ";

                }
                else if (category == "Tender")
                {
                    query = query + $" left join tender_Media_Unit on tender_Media_Unit.tender_Media_Unit_id = approval.media_id  ";

                }
                else if (category == "Project")
                {
                    query = query + $"  ";

                }
                else
                {
                    query = query + $" left join proposal_Media_Unit on proposal_Media_Unit.proposal_Media_Unit_id = approval.media_id  ";

                }


                 
                query = query + $" where expense_transaction.Tenant_ID = @tenantID ";

                query = query + $" and expense_transaction.Is_Voided = false ";

                query = query + $" and expense_transaction.is_cleared = true ";

                query = query + $" and  approval_type = 'Expense'";


                //  query = query + $" and  expense_transaction.is_deposit =  false ";


                if (category == "ContractMediaUnit" || category == "TenderMediaUnit" || category == "ProposalMediaUnit")
                {


                    query = query + $" and  approval.media_id = @categoryID ";
                }
                else
                {


                    query = query + $" and expense_transaction.Category = @category ";

                    query = query + $" and expense_transaction.Category_ID = @categoryID ";

                }






                //query = query + $" and expense_transaction.is_deposit =  false ";


                //           query = query + $" and is_deposit = false ";

                //  query = query + $" and Category = @category ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ExpenseTransactionListVM>(query, new { tenantID = _dbContext.currentTenantID, category, categoryID });

                }




            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching records from db: ${ex.Message}");
                throw new Exception("Unable to fetch data. Please contact the administrator.");
            }

            return result.ToList();
        }


        public async Task<List<ExpenseTransactionList2VM>> ListAllExpenseTransactionsAsync2(string category, string categoryID)
        {

            IEnumerable<ExpenseTransactionList2VM> result;
            try
            {
 


                string query = $" SELECT budget.name as budgetName  ,   {GetColumnsAsPropertiesWithTableName()}  ";



                if (category == "Contract")
                {
                    query = query + $" , contract_Media_Unit.name as MediaName   ";

                }
                else if (category == "Tender")
                {

                    query = query + $" , Tender_Media_Unit.name as MediaName   ";

                }
                else if (category == "Project")
                {
                    query = query + $"  ";

                }
                else
                {
                    query = query + $" , proposal_Media_Unit.name as MediaName   ";

                }
 
                query = query + $" FROM Expense_Transaction";


                query = query + $" left join budget on budget.budget_id = expense_transaction.budget_id ";
 

//                query = query + $" join  approval on  expense_transaction.expense_transaction_id= approval.approval_type_id ";
 

                if (category == "Contract")
                {
                    query = query + $" left join contract_Media_Unit on contract_Media_Unit.contract_media_unit_id = approval.media_id  ";

                }
                else if (category == "Tender")
                {
                    query = query + $" left join tender_Media_Unit on tender_Media_Unit.tender_Media_Unit_id = approval.media_id  ";

                }
                else if (category == "Project")
                {
                    query = query + $"  ";

                }
                else
                {
                    query = query + $" left join proposal_Media_Unit on proposal_Media_Unit.proposal_Media_Unit_id = approval.media_id  ";

                }



                query = query + $" where expense_transaction.Tenant_ID = @tenantID ";

                query = query + $" and expense_transaction.Is_Voided = false ";

             //   query = query + $" and expense_transaction.is_cleared = true ";

              //  query = query + $" and  approval_type = 'Expense'";


                //  query = query + $" and  expense_transaction.is_deposit =  false ";


                if (category == "ContractMediaUnit" || category == "TenderMediaUnit" || category == "ProposalMediaUnit")
                {


                    query = query + $" and  approval.media_id = @categoryID ";
                }
                else
                {


                    query = query + $" and expense_transaction.Category = @category ";

                    query = query + $" and expense_transaction.Category_ID = @categoryID ";

                }






                //query = query + $" and expense_transaction.is_deposit =  false ";


                //           query = query + $" and is_deposit = false ";

                //  query = query + $" and Category = @category ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ExpenseTransactionList2VM>(query, new { tenantID = _dbContext.currentTenantID, category, categoryID });

                }




            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching records from db: ${ex.Message}");
                throw new Exception("Unable to fetch data. Please contact the administrator.");
            }

            return result.ToList();

        }


        public async Task<List<ExpenseTransactionListByVendorVM>> ListAllExpenseTransactionsByVendorAsync(string mediaId, string vendorId)
        {

            IEnumerable<ExpenseTransactionListByVendorVM> result;
            try
            {



                string query = $" SELECT vendor.name as VendorName, expense.name as ExpenseName,   " +
                               $" expense_type.name as ExpenseTypeName,   approval.media_id as MediaId , " +
                               //$" approval.approval_status_id as ApprovalStatusId," +
                               $" {GetColumnsAsPropertiesWithTableName()}  ";

                 
                query = query + $" FROM Expense_Transaction";

                query = query + $" join approval on approval.approval_id  = expense_transaction.approval_id  ";
                query = query + $" join expense on expense_transaction.expense_id  = expense.expense_id ";
                query = query + $" join expense_type on expense_transaction.expense_type_id  = expense_type.expense_type_id  ";
                query = query + $" join vendor on vendor.vendor_id  = expense_transaction.vendor_id   ";

  
                query = query + $" where expense_transaction.Tenant_ID = @tenantID ";

                query = query + $" and expense_transaction.Is_Voided = false ";

                query = query + $" and expense_transaction.vendor_id =   @vendorId  ";

                query = query + $" and  media_id =  @mediaId ";

                query = query + $" and  approval.is_voided = false  ";

                query = query + $" and  expense_type.is_voided = false  ";

                query = query + $" and  expense.is_voided = false  ";

                //query = query + $" and  expense.is_approved = true ";

                query = query + $" and approval.approval_status_id = 'ApprvlStatus_2025_03_174b8f22bc-6930-47db-b737-672e3177a851'  ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ExpenseTransactionListByVendorVM>(query, new { tenantID = _dbContext.currentTenantID, vendorId = vendorId , mediaId = mediaId });

                }




            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching records from db: ${ex.Message}");
                throw new Exception("Unable to fetch data. Please contact the administrator.");
            }

            return result.ToList();

        }




       
        public async Task<List<ExpenseTransactionSearchVM>> ListAllExpenseTransactionsSearchAsync(string mediaIds, string expenseId , string expenseTypeId , string vendorId)
        {

            IEnumerable<ExpenseTransactionSearchVM> result;
            try
            {



                string query = $" SELECT  contract_media_unit.name as MediaName, vendor.name as VendorName, expense.name as ExpenseName,   " +
                               $" expense_type.name as ExpenseTypeName,   approval.media_id as MediaId , " +
                               //$" approval.approval_status_id as ApprovalStatusId," +
                               $" {GetColumnsAsPropertiesWithTableName()}  ";


                query = query + $" FROM Expense_Transaction";

                query = query + $" join approval on approval.approval_id  = expense_transaction.approval_id  ";
                query = query + $" join expense on expense_transaction.expense_id  = expense.expense_id ";
                query = query + $" join expense_type on expense_transaction.expense_type_id  = expense_type.expense_type_id  ";
                query = query + $" left join vendor on vendor.vendor_id  = expense_transaction.vendor_id   ";


                query = query + $"   left join contract_media_unit on contract_media_unit.contract_media_unit_id = approval.media_id   ";

               

                query = query + $" where expense_transaction.Tenant_ID = @tenantID ";

                query = query + $" and expense_transaction.Is_Voided = false ";

              //  query = query + $" and expense_transaction.vendor_id =   @vendorId  ";

                query = query + $" and  media_id  in (  @mediaId )";

                query = query + $" and  approval.is_voided = false  ";

                query = query + $" and  expense_type.is_voided = false  ";

                query = query + $" and  expense.is_voided = false  ";

                //query = query + $" and  expense.is_approved = true ";

                query = query + $" and approval.approval_status_id = 'ApprvlStatus_2025_03_174b8f22bc-6930-47db-b737-672e3177a851'  ";

                if(!string.IsNullOrEmpty(expenseId))
                {
                    query = query + $" and expense_transaction.expense_id = @expenseId ";
                }

                if(!string.IsNullOrEmpty(expenseTypeId))
                {
                    query = query + $" and expense_transaction.expense_type_id = @expenseTypeId ";
                }

                if (!string.IsNullOrEmpty(vendorId))
                {
                    query = query + $" and expense_transaction.vendor_id =  @vendorId ";
                }
                

                using (var dbConn = _dbContext.CreateConnection())
                {

                    result = await dbConn.QueryAsync<ExpenseTransactionSearchVM>(query, new { tenantID = _dbContext.currentTenantID, mediaId = mediaIds , expenseId , expenseTypeId, vendorId });

                }




            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching records from db: ${ex.Message}");
                throw new Exception("Unable to fetch data. Please contact the administrator.");
            }

            return result.ToList();

        }


        public async Task<List<ExpenseTransactionListForApprovalVM>> ListAllExpenseTransactionsForApprovalAsync()
        {
            IEnumerable<ExpenseTransactionListForApprovalVM> result;
            try
            {
                string query = string.Empty;

                if (_dbContext.currentUserEmail.ToLower() == "shahid.hakim@wallop.in")
                {

                    query = $" SELECT   expense_transaction.expense_transaction_id AS ExpenseTransactionId, " +
                  $" expense_transaction.expense_id AS ExpenseId, " +
                  $" expense_transaction.expense_type_id  AS ExpenseTypeId, " +
                  $" expense_transaction.name AS Name,   " +
                  $" expense_transaction.description AS Description, " +
                  $" expense_transaction.date_of_expense AS DateOfExpense, " +
                  $" expense_transaction.date_of_payment AS DateOfPayment, " +
                  $" expense_transaction.expense_amount AS ExpenseAmount, " +
                  $" expense_transaction.vendor_id AS VendorId,  " +
                  $" expense_transaction.category AS Category, " +
                  $" expense_transaction.category_id AS CategoryId,  " +
                  $" expense_transaction.is_cleared AS IsCleared, " +
                  $" expense_transaction.is_voided AS IsVoided, " +
                  $" expense_transaction.created_by AS CreatedBy, " +
                  $" expense_transaction.created_date AS CreatedDate, " +
                  $" expense_transaction.last_modified_by AS LastModifiedBy,  " +
                  $" expense_transaction.last_modified_date AS LastModifiedDate, " +
                  $" expense_transaction.tenant_id AS TenantId, " +
                  $" expense_transaction.is_approved AS IsApproved, " +
                  $" expense_transaction.approved_by AS ApprovedBy, " +
                  $" expense_transaction.approved_date AS ApprovedDate, " +
                  $" expense_transaction.approval_id AS ApprovalId, " +
                  $" expense_transaction.is_finance_approval_requested AS IsFinanceApprovalRequested, " +
                  $" expense_transaction.is_finance_approved AS IsFinanceApproved," +
                  $" expense_transaction.finance_approved_by AS FinanceApprovedBy, " +
                  $" expense_transaction.finance_approved_date AS FinanceApprovedDate, " +
                  $" expense_transaction.finance_approval_id AS FinanceApprovalId," +
                  $" expense_transaction.expense_amount_approved AS ExpenseAmountApproved ," +
                  $" approval_status.name as ApprovalStatusName, approval.priority ," +
                  $" approval.requested_by as RequestedBy, " +
                  $" approval.requested_date as RequestedDate , " +
                  $" FinanceApprovalStatus.Name as FinanceApprovalStatusName " +
                  $" from Expense_Transaction " +
                  $" left join approval on approval.approval_id = Expense_Transaction.approval_id   " +
                  $" left join approval_status on approval_status.approval_status_id = approval.approval_status_id  " +
                  $" left join approval as FinanceApproval on FinanceApproval.approval_id = Expense_Transaction.finance_approval_id  " +
                  $" left join approval_status as FinanceApprovalStatus on FinanceApprovalStatus.approval_status_id = FinanceApproval.approval_status_id   " +

                  $" join approval_approver on approval.approval_id = approval_approver.approval_id  ";


                    query = query + $" where expense_transaction.Tenant_ID = @tenantID ";

                    query = query + $" and expense_transaction.Is_Voided = false ";

                    query = query + $"  and Expense_Transaction.approval_id is not null ";

                    query = query + $" and approval.Is_Voided = false ";


                    query = query + $" and approval_approver_email = 'shahid.hakim@wallop.in'";


                }
                else
                {


                    query = $" SELECT   expense_transaction.expense_transaction_id AS ExpenseTransactionId, " +
                  $" expense_transaction.expense_id AS ExpenseId, " +
                  $" expense_transaction.expense_type_id  AS ExpenseTypeId, " +
                  $" expense_transaction.name AS Name,   " +
                  $" expense_transaction.description AS Description, " +
                  $" expense_transaction.date_of_expense AS DateOfExpense, " +
                  $" expense_transaction.date_of_payment AS DateOfPayment, " +
                  $" expense_transaction.expense_amount AS ExpenseAmount, " +
                  $" expense_transaction.vendor_id AS VendorId,  " +
                  $" expense_transaction.category AS Category, " +
                  $" expense_transaction.category_id AS CategoryId,  " +
                  $" expense_transaction.is_cleared AS IsCleared, " +
                  $" expense_transaction.is_voided AS IsVoided, " +
                  $" expense_transaction.created_by AS CreatedBy, " +
                  $" expense_transaction.created_date AS CreatedDate, " +
                  $" expense_transaction.last_modified_by AS LastModifiedBy,  " +
                  $" expense_transaction.last_modified_date AS LastModifiedDate, " +
                  $" expense_transaction.tenant_id AS TenantId, " +
                  $" expense_transaction.is_approved AS IsApproved, " +
                  $" expense_transaction.approved_by AS ApprovedBy, " +
                  $" expense_transaction.approved_date AS ApprovedDate, " +
                  $" expense_transaction.approval_id AS ApprovalId, " +
                  $" expense_transaction.is_finance_approval_requested AS IsFinanceApprovalRequested, " +
                  $" expense_transaction.is_finance_approved AS IsFinanceApproved," +
                  $" expense_transaction.finance_approved_by AS FinanceApprovedBy, " +
                  $" expense_transaction.finance_approved_date AS FinanceApprovedDate, " +
                  $" expense_transaction.finance_approval_id AS FinanceApprovalId," +
                  $" expense_transaction.expense_amount_approved AS ExpenseAmountApproved ," +
                  $" approval_status.name as ApprovalStatusName, approval.priority ," +
                  $" approval.requested_by as RequestedBy, " +
                  $" approval.requested_date as RequestedDate , " +
                  $" FinanceApprovalStatus.Name as FinanceApprovalStatusName " +
                  $" from Expense_Transaction " +
                  $" left join approval on approval.approval_id = Expense_Transaction.approval_id   " +
                  $" left join approval_status on approval_status.approval_status_id = approval.approval_status_id  " +
                  $" left join approval as FinanceApproval on FinanceApproval.approval_id = Expense_Transaction.finance_approval_id  " +
                  $" left join approval_status as FinanceApprovalStatus on FinanceApprovalStatus.approval_status_id = FinanceApproval.approval_status_id   ";



                    query = query + $" where expense_transaction.Tenant_ID = @tenantID ";

                    query = query + $" and expense_transaction.Is_Voided = false ";

                    query = query + $"  and Expense_Transaction.approval_id is not null ";

                    query = query + $" and approval.Is_Voided = false ";



                }



                // query = query + $" and expense_transaction.is_approved = true ";

                // query = query + $" and is_finance_approved = false ";





                //query = query + $" and Category = @category ";

                //query = query + $" and Category_ID = @categoryID ";


                using (var dbConn = _dbContext.CreateConnection())
                {
                    // result = await dbConn.QueryAsync<ExpenseTransactionListForApprovalVM>(query, new { tenantID = _dbContext.currentTenantID, category, categoryID });
                    result = await dbConn.QueryAsync<ExpenseTransactionListForApprovalVM>(query, new { tenantID = _dbContext.currentTenantID });


                }

                //if (_dbContext.currentUserEmail.ToLower() == "shahid.hakim@wallop.in")
                //{




                //    join approval_approver on approval.approval_id = approval_approver.approval_id " +
                //    $" where approval_approver_email = @userEmail 
                //    result = result.Where(x=>app)
                // }


            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching records from db: ${ex.Message}");
                throw new Exception("Unable to fetch data. Please contact the administrator.");
            }

            return result.ToList();
        }



        public async Task<ExpenseTransactionDetailVM> GetExpenseTransactionDetailsAsync(string entityID)
        {
            ExpenseTransactionDetailVM result;
            try
            {
                string query = $"select   {GetColumnsAsPropertiesWithTableName()}  , " +
                    $" " +
                    $" expense.name as ExpenseName  ," +
                    $" expense_type.name     as ExpenseTypeName ," +
                    $" vendor.name as VendorName " +
                    $" FROM Expense_Transaction " +

                    $" left join  expense on  expense.expense_id = Expense_Transaction.expense_id" +
                    $" left join  expense_type on expense_type.expense_type_id = Expense_Transaction.expense_type_id" +
                    $" left join  vendor on  vendor.vendor_id = Expense_Transaction.vendor_id" ;

               

                query = query + $" where Expense_Transaction.Tenant_ID = @tenantID ";

                query = query + $" and Expense_Transaction.Is_Voided = false ";

                query = query + $" and Expense_Transaction.Expense_Transaction_ID = @entityID ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryFirstAsync<ExpenseTransactionDetailVM>(query, new { tenantID = _dbContext.currentTenantID, entityID });

                }



            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching records from db: ${ex.Message}");
                throw new Exception("Unable to fetch data. Please contact the administrator.");
            }

            return result;
        }


    }
}