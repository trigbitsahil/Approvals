using MediatR;

namespace OOH.Application.Features.Global.Accounts.Commands.DeleteAccount
{
    public class DeleteAccountCommand : IRequest<DeleteAccountCommandResponse>
    {
        public string AccountID { get; set; }
    }
}
