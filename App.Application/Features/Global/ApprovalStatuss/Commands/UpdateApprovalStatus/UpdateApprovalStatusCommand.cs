using MediatR;

namespace OOH.Application.Features.Global.ApprovalStatuss.Commands.UpdateApprovalStatus
{
    public class UpdateApprovalStatusCommand : IRequest<UpdateApprovalStatusCommandResponse>
    {


        public string ApprovalStatusID { get; set; }

        public string Name { get; set; }
 





    }
}
