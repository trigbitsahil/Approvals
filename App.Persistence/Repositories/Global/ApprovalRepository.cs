using Dapper;
using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalList;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalListByUser;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalWithTypeDetail;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail;
 
using OOH.Application.StaticResources;
using OOH.Domain.Entities.Global;

namespace OOH.Persistence.Repositories
{
    public class ApprovalRepository : BaseRepository<Approval>, IApprovalRepository
    {
        public ApprovalRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



        public async Task<List<ApprovalListVM>> ListAllApprovalsAsync(string category, string categoryID)
        {
            IEnumerable<ApprovalListVM> result;

            try
            {


                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()} , approval_status.name as ApprovalStatusName ,  department.name as DepartmentName   FROM Approval";

                query = query + $" join approval_status on approval_status.approval_status_id = Approval.approval_status_id " +


                  $" left join department on " +

                  $" department.department_id = Approval.department_id ";

                query = query + $" where Approval.Tenant_ID = @tenantID ";

                query = query + $" and Approval.Is_Voided = false ";

                query = query + $" and Approval.Category = @category ";

                query = query + $" and Approval.Category_ID = @categoryID ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ApprovalListVM>(query, new { tenantID = _dbContext.currentTenantID, category = category, categoryID = categoryID });

                }



            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching records from db: ${ex.Message}");
                throw new Exception("Unable to fetch data. Please contact the administrator.");
            }

            return result.ToList();
        }

        public async Task<List<ApprovalListByUserVM>> ListAllApprovalsByUserAsync()
        {

            string departmentId = string.Empty;

            IEnumerable<ApprovalListByUserVM> result;
            try
            {
                string query2 = "  select \"DepartmentId\" from public.\"AspNetUsers\" \r\n  where \"Email\" = @userEmail ";

                query2 = query2 + $" and  \"TenantID\" = @tenantID ";

                query2 = query2 + $" and \"IsVoided\" = false ";


                using (var dbConn = _dbContext.CreateConnection())
                {
                    departmentId = await dbConn.QueryFirstOrDefaultAsync<string>(query2, new { tenantID = _dbContext.currentTenantID, userEmail = _dbContext.currentUserEmail });

                }

                //string query = $" select {GetColumnsAsPropertiesWithTableName()}  from approval where requested_by = @userEmail" +
                //    $" union all " +
                //    $" select approval.* from approval " +
                //    $" join approval_approver on approval.approval_id = approval_approver.approval_id " +
                //    $" where approval_approver_email = @userEmail ";


                //query = query + $" Tenant_ID = @tenantID ";

                //query = query + $" and Is_Voided = false ";


                string query = $"select subquery.* , approval_status.name as ApprovalStatusName , department.name as DepartmentName from  (select  {GetColumnsAsPropertiesWithTableName()} from approval where department_id =   @departmentId or   created_by =  @userEmail " +
                    $" union all " +
                    $" select approval.* from approval join approval_approver on approval.approval_id = approval_approver.approval_id " +
                    $" where approval_approver_email = @userEmail ) as subquery " +
                    $" join approval_status on " +
                    $" approval_status.approval_status_id = subquery.approvalstatusid " +

                    $" left join department on " +
                    $" department.department_id = subquery.departmentid ";

                query = query + $" where  subquery.TenantID = @tenantID ";

                query = query + $" and subquery.IsVoided = false ";


                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ApprovalListByUserVM>(query, new { tenantID = _dbContext.currentTenantID, departmentId = departmentId, userEmail = _dbContext.currentUserEmail });

                    if (result.Count() > 0)
                    {

                        result = result.DistinctBy(x => x.ApprovalID).ToList();

                        if (_dbContext.currentUserEmail.ToLower() == "shahid.hakim@wallop.in")
                        {
                            result = result.Where(x => x.ApprovalType != "Expense" && x.ApprovalType != "FinanceExpense");

                        }

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




        public async Task<ApprovalDetailVM> GetApprovalDetails(string id,string category)

        {
            ApprovalDetailVM result;
            try
            {


                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()} , approval_status.name as ApprovalStatusName ,department.name as DepartmentName ,";

                if (category == "Contract")
                {
                    query = query + $" contract_media_unit.name as  MediaName , contract.name as ContractName";
                }
                else if (category == "Tender")
                {
                    query = query + $" tender_media_unit.name as  MediaName , tender.name as ContractName";
                }
               else  if (category == "Proposal")
                {
                    query = query + $" proposal_media_unit.name as  MediaName , proposal.name as ContractName";
                }
                else if (category == "Project")
                {
                    query = query + $"   project.name as ContractName";

                }

                query = query + $" FROM Approval";
                 
                query = query + $" left  join approval_status on approval_status.approval_status_id = Approval.approval_status_id ";

                query = query + $" left  join department on department.department_id = Approval.department_id ";

                if (category == "Contract")
                {

                    query = query + $" left  join contract_media_unit on contract_media_unit.contract_media_unit_id = Approval.media_id ";

                    query = query + $" left  join contract  on contract.contract_id = Approval.category_id ";

                }
                else if (category == "Tender")
                {

                    query = query + $" left  join tender_media_unit on tender_media_unit.tender_media_unit_id = Approval.media_id ";

                    query = query + $" left  join tender  on tender.tender_id = Approval.category_id ";

                }
                else if (category == "Proposal")
                {

                    query = query + $" left  join proposal_media_unit on proposal_media_unit.proposal_media_unit_id = Approval.media_id ";

                    query = query + $" left  join proposal  on proposal.proposal_id = Approval.category_id ";

                }

                else if (category == "Project")
                {


                    query = query + $" left  join project  on project.project_id = Approval.category_id ";

                }
                query = query + $" where Approval.Tenant_ID = @tenantID ";

                query = query + $" and Approval.Is_Voided = false ";

                query = query + $" and Approval.Approval_ID = @id ";


                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryFirstAsync<ApprovalDetailVM>(query, new { tenantID = _dbContext.currentTenantID, id = id });
                }



            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching records from db: ${ex.Message}");
                throw new Exception("Unable to fetch data. Please contact the administrator.");
            }

            return result;


        }


        public async Task<ApprovalWithTypeDetailVM> GetApprovalWithApprovalTypeDetails(string id, string category)

        {
            ApprovalWithTypeDetailVM result = new ApprovalWithTypeDetailVM();
            try
            {

                //string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()} , approval_status.name as ApprovalStatusName ,department.name as DepartmentName ,contract_media_unit.name as  MediaName , contract.name as ContractName FROM Approval";

                //query = query + $" left join approval_status on approval_status.approval_status_id = Approval.approval_status_id ";

                //query = query + $" left join department on department.department_id = Approval.department_id ";

                //query = query + $" left join contract_media_unit on contract_media_unit.contract_media_unit_id = Approval.media_id ";

                //query = query + $" left join contract  on contract.contract_id = Approval.category_id ";

                //query = query + $" where Approval.Tenant_ID = @tenantID ";

                //query = query + $" and Approval.Is_Voided = false ";

                //query = query + $" and Approval.Approval_ID = @id ";

                 
                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()} , approval_status.name as ApprovalStatusName ,department.name as DepartmentName ,";

                if (category == "Contract")
                {
                    query = query + $" contract_media_unit.name as  MediaName , contract.name as ContractName";
                }
                else if (category == "Tender")
                {
                    query = query + $" tender_media_unit.name as  MediaName , tender.name as ContractName";
                }
                else if (category == "Proposal")
                {
                    query = query + $" proposal_media_unit.name as  MediaName , proposal.name as ContractName";
                }

                else if (category == "Project")
                {
                    query = query + $"   project.name as ContractName";

                }

                query = query + $" FROM Approval";

                query = query + $" left  join approval_status on approval_status.approval_status_id = Approval.approval_status_id ";

                query = query + $" left  join department on department.department_id = Approval.department_id ";

                if (category == "Contract")
                {

                    query = query + $" left  join contract_media_unit on contract_media_unit.contract_media_unit_id = Approval.media_id ";

                    query = query + $" left  join contract  on contract.contract_id = Approval.category_id ";

                }
                else if (category == "Tender")
                {

                    query = query + $" left  join tender_media_unit on tender_media_unit.tender_media_unit_id = Approval.media_id ";

                    query = query + $" left  join tender  on tender.tender_id = Approval.category_id ";

                }
                else if (category == "Proposal")
                {

                    query = query + $" left  join proposal_media_unit on proposal_media_unit.proposal_media_unit_id = Approval.media_id ";

                    query = query + $" left  join proposal  on proposal.proposal_id = Approval.category_id ";

                }
                else if (category == "Project")
                {
                    query = query + $" left  join project  on project.project_id = Approval.category_id ";

                }

                query = query + $" where Approval.Tenant_ID = @tenantID ";

                query = query + $" and Approval.Is_Voided = false ";

                query = query + $" and Approval.Approval_ID = @id ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result.ApprovalDetails = await dbConn.QueryFirstAsync<ApprovalDetailVM>(query, new { tenantID = _dbContext.currentTenantID, id = id });
                }

                if (result.ApprovalDetails != null)
                {

                    if (result.ApprovalDetails.ApprovalType == "Letter")
                    {

                      

                    }

                    else if (result.ApprovalDetails.ApprovalType == "Expense" || result.ApprovalDetails.ApprovalType == "FinanceExpense")
                    {

                        string query1 = $" select  expense_transaction.name as Name ,expense_transaction.description as Description, " +
                            $" expense_transaction.date_of_expense as DateOfExpense , " +
                            $" expense.name as ExpenseName,  expense_type.name as ExpenseTypeName " +
                            $" from  expense_transaction " +
                            $" left join expense on expense.expense_id = expense_transaction.expense_id " +
                            $" left join expense_type on  expense_type.expense_type_id = expense_transaction.expense_type_id";

                        query1 = query1 + $" where  expense_transaction.Tenant_ID = @tenantID ";

                        query1 = query1 + $" and expense_transaction.Is_Voided = false ";

                        query1 = query1 + $" and expense_transaction.expense_transaction_id = @id ";

                        using (var dbConn = _dbContext.CreateConnection())
                        {
                            result.ExpenseTransactionDetails = await dbConn.QueryFirstAsync<ExpenseTransactionDetailVM>(query1, new { tenantID = _dbContext.currentTenantID, id = result.ApprovalDetails.ApprovalTypeId });

                        }
                    }


                    else if (result.ApprovalDetails.ApprovalType == "OfficeNote")
                    { 

                    }


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