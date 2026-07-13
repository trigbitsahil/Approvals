using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Accounts.Commands.UpdateAccount
{
    public class UpdateAccountCommandResponse : BaseResponse
    {

        public UpdateAccountCommandResponse() : base()
        {

        }

        public UpdateAccountDto Data { get; set; } = default!;

    }
}
