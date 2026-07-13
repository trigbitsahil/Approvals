using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListForApproval
{
    public class ExpenseTransactionListForApprovalVM
    {
        public string ExpenseTransactionID { get; set; }

        public string ExpenseId { get; set; }

        public string ExpenseTypeId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime DateOfExpense { get; set; }

        public DateTime? DateOfPayment { get; set; }

        public decimal ExpenseAmount { get; set; }

        public string VendorId { get; set; }

        public string Category { get; set; }

        public string CategoryID { get; set; }

        public bool IsCleared { get; set; }

        public bool IsVoided { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string LastModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }


        public string ExpenseName { get; set; }

        public string ExpenseTypeName { get; set; }


    
        public bool IsApproved { get; set; }
 
        public string ApprovedBy { get; set; }
 
        public DateTime? ApprovedDate { get; set; }
 
        public string ApprovalId { get; set; }
 
        public bool IsFinanceApprovalRequested { get; set; }
 
        public bool IsFinanceApproved { get; set; }
 
        public string FinanceApprovedBy { get; set; }
 
        public DateTime? FinanceApprovedDate { get; set; }
  
        public string FinanceApprovalId { get; set; }
 
        public decimal? ExpenseAmountApproved { get; set; }

        public string RequestedBy { get; set; }

        public DateTime RequestedDate { get; set; }

        public string Priority { get; set; }

        public string ApprovalStatusName { get; set; }


        public string FinanceApprovalStatusName { get; set; }




        public bool IsAdvance { get; set; }

        public bool IsDeposit { get; set; }

        public DateTime? DepositReturnedDate { get; set; }

        public string DepositReturnNotes { get; set; }

        public string? BudgetId { get; set; }
    }
}
