using MediatR;
using OOH.Application.Responses;

namespace OOH.Application.Features.Global.Approvals.Commands.ClearAllData
{
    public class ClearAllDataCommandResponse : BaseResponse
    {
    }

    public class ClearAllDataCommand : IRequest<ClearAllDataCommandResponse>
    {
    }
}
