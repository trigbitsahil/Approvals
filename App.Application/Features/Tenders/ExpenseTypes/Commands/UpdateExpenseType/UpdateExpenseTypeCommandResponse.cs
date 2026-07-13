using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.UpdateExpenseType
{
    public class UpdateExpenseTypeCommandResponse : BaseResponse
    {

        public UpdateExpenseTypeCommandResponse() : base()
        {

        }

        public UpdateExpenseTypeDto Data { get; set; } = default!;

    }
}
