using Dapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalList;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalListByUser;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalWithTypeDetail;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail;
 
using OOH.Application.StaticResources;
using OOH.Domain.Entities.Global;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace OOH.Persistence.Repositories
{
    public class ApprovalRepository : BaseRepository<Approval>, IApprovalRepository
    {
        private readonly IEncryptionService _encryptionService;
        private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
        private readonly Microsoft.Extensions.Logging.ILogger<ApprovalRepository> _logger;

        public ApprovalRepository(DapperDBContext dbContext, IEncryptionService encryptionService, Microsoft.AspNetCore.Http.IHttpContextAccessor httpContextAccessor, Microsoft.Extensions.Configuration.IConfiguration configuration, Microsoft.Extensions.Logging.ILogger<ApprovalRepository> logger) : base(dbContext)
        {
            _encryptionService = encryptionService;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _logger = logger;
        }

        private bool IsViewUnlocked()
        {
            try {
                if (_httpContextAccessor.HttpContext?.Request?.Headers.TryGetValue("X-View-Password", out var passwordHeader) == true)
                {
                    var encryptedExpectedPassword = _configuration["ActualViewPassword"];
                    
                    if (string.IsNullOrEmpty(encryptedExpectedPassword))
                    {
                        _logger.LogWarning("ActualViewPassword configuration is missing.");
                        return false;
                    }

                    string expectedPassword;
                    try 
                    {
                        expectedPassword = _encryptionService.Decrypt(encryptedExpectedPassword);
                    } 
                    catch 
                    {
                        expectedPassword = encryptedExpectedPassword;
                    }
                    
                    bool isUnlocked = passwordHeader.ToString() == expectedPassword;
                    _logger.LogInformation("Header provided.: '{PasswordHeader}', Expected: '{ExpectedPassword}', Unlocked: {IsUnlocked}", passwordHeader, expectedPassword, isUnlocked);
                    return isUnlocked;
                }
                _logger.LogInformation("X-View-Password header missing. Headers: {Headers}", string.Join(", ", _httpContextAccessor.HttpContext?.Request?.Headers.Keys ?? new List<string>()));
            } catch (Exception ex) {
                _logger.LogError(ex, "Exception in IsViewUnlocked: {Message}", ex.Message);
            }
            return false;
        }



        public async Task<List<ApprovalListVM>> ListAllApprovalsAsync(string category, string categoryID)
        {
            IEnumerable<ApprovalListVM> result;

            try
            {


                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()} , approval_status.name as ApprovalStatusName FROM Approval";

                query = query + $" join approval_status on approval_status.approval_status_id = Approval.approval_status_id ";


                query = query + $" where Approval.Tenant_ID = @tenantID ";

                query = query + $" and Approval.Is_Voided = false ";

                query = query + $" and Approval.Category = @category ";

                query = query + $" and Approval.Category_ID = @categoryID ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<ApprovalListVM>(query, new { tenantID = _dbContext.currentTenantID, category = category, categoryID = categoryID });

                }

                if (result != null)
                {
                    bool isUnlocked = IsViewUnlocked();
                    foreach (var item in result)
                    {
                        if (isUnlocked)
                        {
                            if (!string.IsNullOrEmpty(item.Name)) item.Name = _encryptionService.Decrypt(item.Name);
                            if (!string.IsNullOrEmpty(item.Description)) item.Description = _encryptionService.Decrypt(item.Description);
                        }
                        else
                        {
                            item.Name = "";
                            item.Description = "";
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


                string query = $"select subquery.* , approval_status.name as ApprovalStatusName from  (select  {GetColumnsAsPropertiesWithTableName()} from approval where department_id =   @departmentId or   created_by =  @userEmail " +
                    $" union all " +
                    $" select approval.* from approval join approval_approver on approval.approval_id = approval_approver.approval_id " +
                    $" where approval_approver_email = @userEmail ) as subquery " +
                    $" join approval_status on " +
                    $" approval_status.approval_status_id = subquery.approvalstatusid ";

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

                if (result != null)
                {
                    bool isUnlocked = IsViewUnlocked();
                    foreach (var item in result)
                    {
                        if (isUnlocked)
                        {
                            if (!string.IsNullOrEmpty(item.Name)) item.Name = _encryptionService.Decrypt(item.Name);
                            if (!string.IsNullOrEmpty(item.Description)) item.Description = _encryptionService.Decrypt(item.Description);
                        }
                        else
                        {
                            item.Name = "";
                            item.Description = "";
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


                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()} , approval_status.name as ApprovalStatusName, from_bank.name as FromBankName, to_bank.name as ToBankName, vendor.name as VendorName";

                if (category == "Contract")
                {
                    query = query + $" , contract_media_unit.name as  MediaName , contract.name as ContractName";
                }
                else if (category == "Tender")
                {
                    query = query + $" , tender_media_unit.name as  MediaName , tender.name as ContractName";
                }
               else  if (category == "Proposal")
                {
                    query = query + $" , proposal_media_unit.name as  MediaName , proposal.name as ContractName";
                }
                else if (category == "Project")
                {
                    query = query + $" , project.name as ContractName";
                }

                query = query + $" FROM Approval";
                 
                query = query + $" left  join approval_status on approval_status.approval_status_id = Approval.approval_status_id ";
                query = query + $" left  join banks as from_bank on from_bank.bank_id = Approval.from_bank_id ";
                query = query + $" left  join banks as to_bank on to_bank.bank_id = Approval.to_bank_id ";
                query = query + $" left  join vendor on vendor.vendor_id = Approval.vendor_id ";

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

                if (result != null)
                {
                    if (IsViewUnlocked())
                    {
                        if (!string.IsNullOrEmpty(result.Name)) result.Name = _encryptionService.Decrypt(result.Name);
                        if (!string.IsNullOrEmpty(result.Description)) result.Description = _encryptionService.Decrypt(result.Description);
                    }
                    else
                    {
                        result.Name = "";
                        result.Description = "";
                    }
                }



            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching records from db: ${ex.Message}");
                throw new Exception($"Unable to fetch data. Please contact the administrator. Inner: {ex.Message}");
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

                 
                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()} , approval_status.name as ApprovalStatusName";

                if (category == "Contract")
                {
                    query = query + $" , contract_media_unit.name as  MediaName , contract.name as ContractName";
                }
                else if (category == "Tender")
                {
                    query = query + $" , tender_media_unit.name as  MediaName , tender.name as ContractName";
                }
                else if (category == "Proposal")
                {
                    query = query + $" , proposal_media_unit.name as  MediaName , proposal.name as ContractName";
                }

                else if (category == "Project")
                {
                    query = query + $" , project.name as ContractName";

                }

                query = query + $" FROM Approval";

                query = query + $" left  join approval_status on approval_status.approval_status_id = Approval.approval_status_id ";

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
                    if (IsViewUnlocked())
                    {
                        if (!string.IsNullOrEmpty(result.ApprovalDetails.Name)) result.ApprovalDetails.Name = _encryptionService.Decrypt(result.ApprovalDetails.Name);
                        if (!string.IsNullOrEmpty(result.ApprovalDetails.Description)) result.ApprovalDetails.Description = _encryptionService.Decrypt(result.ApprovalDetails.Description);
                    }
                    else
                    {
                        result.ApprovalDetails.Name = "";
                        result.ApprovalDetails.Description = "";
                    }

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
                throw new Exception($"Unable to fetch data. Please contact the administrator. Inner: {ex.Message}");
            }

            return result;


        }

    }
}