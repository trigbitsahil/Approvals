using MediatR;

namespace OOH.Application.Features.Global.ApprovalTypes.Commands.CreateApprovalType
{
    public class CreateApprovalTypeCommand : IRequest<CreateApprovalTypeCommandResponse>
    {

 

        public string Name { get; set; }

        



    }
}
