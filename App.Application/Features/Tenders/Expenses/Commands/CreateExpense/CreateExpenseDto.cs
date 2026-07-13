namespace OOH.Application.Features.Tenders.Expenses.Commands.CreateExpense
{
    public class CreateExpenseDto
    {


        public string ExpenseID { get; set; }

        public string ExpenseTypeId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool IsVoided { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

         

    }
}
