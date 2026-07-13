using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList2
{
    public class ExpenseTransactionList2VM
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




   
        public bool IsAdvance { get; set; }
 
        public bool IsDeposit { get; set; }
 
        public DateTime? DepositReturnedDate { get; set; }
 
        public string DepositReturnNotes { get; set; }


        public string MediaId { get; set; }

        public string MediaName { get; set; }

        public string? BudgetId { get; set; }

        public string BudgetName { get; set; }


        public decimal ExpenseAmountApproved { get; set; }

    }
}
