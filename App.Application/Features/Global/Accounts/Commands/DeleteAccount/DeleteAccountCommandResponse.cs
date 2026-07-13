using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Accounts.Commands.DeleteAccount
{
    public class DeleteAccountCommandResponse : BaseResponse
    {

        public DeleteAccountCommandResponse() : base()
        {

        }

        public string Data { get; set; } = default!;

    }
}
