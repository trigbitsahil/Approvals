using OOH.Application.Responses;

namespace OOH.Application.Features.Tenders.Distributors.Commands.DeleteDistributor
{
    public class DeleteDistributorCommandResponse : BaseResponse
    {
        public DeleteDistributorCommandResponse() : base()
        {
        }

        public string Data { get; set; }
    }
}
