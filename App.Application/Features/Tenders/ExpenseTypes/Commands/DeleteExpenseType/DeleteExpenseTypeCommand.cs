using MediatR;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.DeleteExpenseType
{
    public class DeleteExpenseTypeCommand : IRequest<DeleteExpenseTypeCommandResponse>
    {
        public string ExpenseTypeID { get; set; }
    }
}
