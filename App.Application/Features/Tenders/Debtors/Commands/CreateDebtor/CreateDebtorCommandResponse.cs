using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Debtors.Commands.CreateDebtor
{
    public class CreateDebtorCommandResponse : BaseResponse
    {
        public CreateDebtorCommandResponse() : base()
        {
        }

        public CreateDebtorDto Data { get; set; }
    }
}
