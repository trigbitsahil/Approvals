using MediatR;

namespace OOH.Application.Features.Global.ApprovalStatuss.Commands.CreateApprovalStatus
{
    public class CreateApprovalStatusCommand : IRequest<CreateApprovalStatusCommandResponse>
    {


        public string Name { get; set; }




    }
}
