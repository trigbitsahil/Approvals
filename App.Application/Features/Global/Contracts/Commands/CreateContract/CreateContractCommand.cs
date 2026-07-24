using MediatR;
using OOH.Application.Responses;
using System;

namespace OOH.Application.Features.Global.Contracts.Commands.CreateContract
{
    public class CreateContractDto
    {
        public string ContractId { get; set; }
        public string Name { get; set; }
        public string? Number { get; set; }
        public bool IsVoided { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateContractCommandResponse : BaseResponse
    {
        public CreateContractCommandResponse() : base() { }
        public CreateContractDto Data { get; set; }
    }

    public class CreateContractCommand : IRequest<CreateContractCommandResponse>
    {
        public string Name { get; set; }
        public string? Number { get; set; }
    }
}
