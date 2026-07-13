using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.UpdateExpenseType
{
    public class UpdateExpenseTypeDto
    {
        public string ExpenseTypeID { get; set; }

        public string Name { get; set; }
 
        public bool IsVoided { get; set; }
 
        public string CreatedBy { get; set; }
   
        public DateTime CreatedDate { get; set; }
  
        public string LastModifiedBy { get; set; }
 
        public DateTime? LastModifiedDate { get; set; }

        public string ExpenseCategoryId { get; set; }


    }
}
