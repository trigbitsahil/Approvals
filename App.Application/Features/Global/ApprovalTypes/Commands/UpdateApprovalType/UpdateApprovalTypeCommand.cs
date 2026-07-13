using MediatR;

namespace OOH.Application.Features.Global.ApprovalTypes.Commands.UpdateApprovalType
{
    public class UpdateApprovalTypeCommand : IRequest<UpdateApprovalTypeCommandResponse>
    {
   

        public string ApprovalTypeID { get; set; }
      
        public string Name { get; set; }




    }
}
