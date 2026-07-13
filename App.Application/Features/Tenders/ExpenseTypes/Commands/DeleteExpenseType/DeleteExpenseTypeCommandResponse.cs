using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.DeleteExpenseType
{
    public class DeleteExpenseTypeCommandResponse : BaseResponse
    {

        public DeleteExpenseTypeCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
