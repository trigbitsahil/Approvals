using MediatR;

namespace OOH.Application.Features.Tenders.Debtors.Commands.DeleteDebtor
{
    public class DeleteDebtorCommand : IRequest<DeleteDebtorCommandResponse>
    {
        public string DebtorId { get; set; }
    }
}
