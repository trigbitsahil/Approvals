using MediatR;

namespace OOH.Application.Features.Tenders.Distributors.Commands.DeleteDistributor
{
    public class DeleteDistributorCommand : IRequest<DeleteDistributorCommandResponse>
    {
        public string DistributorId { get; set; }
    }
}
