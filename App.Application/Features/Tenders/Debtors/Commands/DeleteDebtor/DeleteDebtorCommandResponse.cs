using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Debtors.Commands.DeleteDebtor
{
    public class DeleteDebtorCommandResponse : BaseResponse
    {
        public DeleteDebtorCommandResponse() : base()
        {
        }

        public string Data { get; set; }
    }
}
