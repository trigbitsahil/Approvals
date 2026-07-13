using OOH.Application.Responses;

namespace OOH.Application.Features.Global.ApprovalStatuss.Commands.CreateApprovalStatus
{
    public class CreateApprovalStatusCommandResponse : BaseResponse
    {

        public CreateApprovalStatusCommandResponse() : base()
        {

        }

        public CreateApprovalStatusDto Data { get; set; } = default!;

    }
}
