using MediatR;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Contracts.Commands.UpdateContract
{
    public class UpdateContractDto
    {
        public string ContractId { get; set; }
        public string Name { get; set; }
        public string? Number { get; set; }
        public bool IsVoided { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }

    public class UpdateContractCommandResponse : BaseResponse
    {
        public UpdateContractCommandResponse() : base() { }
        public UpdateContractDto Data { get; set; }
    }

    public class UpdateContractCommand : IRequest<UpdateContractCommandResponse>
    {
        public string ContractId { get; set; }
        public string Name { get; set; }
        public string? Number { get; set; }
    }
}
