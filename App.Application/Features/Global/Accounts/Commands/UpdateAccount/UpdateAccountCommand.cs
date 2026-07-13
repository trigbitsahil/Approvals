using MediatR;

namespace OOH.Application.Features.Global.Accounts.Commands.UpdateAccount
{
    public class UpdateAccountCommand : IRequest<UpdateAccountCommandResponse>
    {
   

        public string AccountID { get; set; }

      
      


 
    }
}
