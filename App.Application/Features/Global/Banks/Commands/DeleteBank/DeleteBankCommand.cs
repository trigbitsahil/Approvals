using MediatR;

namespace OOH.Application.Features.Global.Banks.Commands.DeleteBank
{
    public class DeleteBankCommand : IRequest<bool>
    {
        public string BankId { get; set; }
    }
}
