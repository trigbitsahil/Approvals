using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Distributors.Commands.CreateDistributor
{
    public class CreateDistributorCommandResponse : BaseResponse
    {
        public CreateDistributorCommandResponse() : base()
        {
        }

        public CreateDistributorDto Data { get; set; }
    }
}
