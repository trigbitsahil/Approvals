using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.UpdateExpenseType
{
    public class UpdateExpenseTypeCommand : IRequest<UpdateExpenseTypeCommandResponse>
    {


        public string ExpenseTypeID { get; set; }

        public string Name { get; set; }

        public string ExpenseCategoryId { get; set; }



        


    }
}
