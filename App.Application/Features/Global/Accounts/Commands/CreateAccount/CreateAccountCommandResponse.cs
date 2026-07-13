using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Accounts.Commands.CreateAccount
{
    public class CreateAccountCommandResponse : BaseResponse
    {

        public CreateAccountCommandResponse() : base()
        {

        }

        public CreateAccountDto Data { get; set; } = default!;

    }
}
