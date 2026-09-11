using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Debtors.Commands.UpdateDebtor
{
    public class UpdateDebtorCommandResponse : BaseResponse
    {
        public UpdateDebtorCommandResponse() : base()
        {
        }

        public UpdateDebtorDto Data { get; set; }
    }
}
