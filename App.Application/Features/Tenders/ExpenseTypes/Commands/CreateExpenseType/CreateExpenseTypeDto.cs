namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.CreateExpenseType
{
    public class CreateExpenseTypeDto
    {

        public string ExpenseTypeID { get; set; }

        public string Name { get; set; }

        public bool IsVoided { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string ExpenseCategoryId { get; set; }



    }
}
