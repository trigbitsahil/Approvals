using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OOH.Application.Features.Tenders.Expenses.Commands.UpdateExpense
{
    public class UpdateExpenseDto
    {
 
        public string ExpenseID { get; set; }
       
        public string ExpenseTypeId { get; set; }
     
        public string Name { get; set; }
 
        public string Description { get; set; }
 
        public bool IsVoided { get; set; }
 
        public string CreatedBy { get; set; }
  
        public DateTime CreatedDate { get; set; }
 
        public string LastModifiedBy { get; set; }
  
        public DateTime? LastModifiedDate { get; set; }
       

    }
}
