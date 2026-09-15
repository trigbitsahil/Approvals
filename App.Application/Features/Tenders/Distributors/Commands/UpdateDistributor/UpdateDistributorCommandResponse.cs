using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Distributors.Commands.UpdateDistributor
{
    public class UpdateDistributorCommandResponse : BaseResponse
    {
        public UpdateDistributorCommandResponse() : base()
        {
        }

        public UpdateDistributorDto Data { get; set; }
    }
}
