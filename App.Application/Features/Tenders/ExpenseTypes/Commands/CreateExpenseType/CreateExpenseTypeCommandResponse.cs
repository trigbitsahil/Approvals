using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.CreateExpenseType
{
    public class CreateExpenseTypeCommandResponse : BaseResponse
    {

        public CreateExpenseTypeCommandResponse() : base()
        {

        }

        public CreateExpenseTypeDto Data { get; set; } = default!;

    }
}
